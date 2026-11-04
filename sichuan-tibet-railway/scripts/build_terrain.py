"""Cut Copernicus GLO-90 into a two-level terrain pyramid (the v1 5 km GEBCO grid stays as level 0).

Input : raw/cop90/*.tif (scripts/fetch_dem.py), raw/route_geom.json (scripts/build_route.py)
Output: tiles/z1/{ix}_{iy}.png   1° tiles, 0.005° (~500 m) spacing, whole map
        tiles/z2/{ix}_{iy}.png   0.25° tiles, 3" (~90 m) or 5" (~150 m) spacing, within 15 km of the line
        data/tiles.json          tile index
        raw/mosaic.npy           int16 mosaic (27–33°N, 90–105°E at 3"), reused by build_profile/build_rivers
Tile names: ix = (lon0 - 90) / size, iy = (lat0 - 27) / size, (lon0, lat0) = south-west corner.
Each tile holds (n + 3)^2 samples: n + 1 nodes per side plus one padding sample all round,
row 0 = north. Height (m) = R * 256 + G - 1000.

Usage: python scripts/build_terrain.py [--z2-step 3|5] [--out DIR]
"""
import argparse, glob, math, os, re, time
import numpy as np
from PIL import Image
from scipy import ndimage
from scipy.spatial import cKDTree
import rasterio
from common import RAW, DATA, TILES, BOX, CORRIDOR_KM, ENC_OFFSET, load_json, dump_json

LAT_TOP, LON_LEFT, PX = 33.0, 90.0, 1200       # mosaic: row r -> lat 33 - r/1200, col c -> lon 90 + c/1200
ROWS, COLS = 6 * PX, 15 * PX
BLEND_KM = 3.0                                  # z2 fades into z1 between 15 and 18 km from the line


def mosaic():
    path = f'{RAW}/mosaic.npy'
    if os.path.exists(path):
        return np.load(path, mmap_mode='r')
    M = np.zeros((ROWS, COLS), np.int16)
    for f in sorted(glob.glob(f'{RAW}/cop90/*.tif')):
        m = re.search(r'N(\d+)_00_E(\d+)_00', f)
        la, lo = int(m.group(1)), int(m.group(2))
        with rasterio.open(f) as r:
            a = r.read(1)
            assert a.shape == (PX, PX) and abs(r.transform.c - (lo - 0.5 / PX)) < 1e-9
        r0, c0 = (LAT_TOP - (la + 1)) * PX, (lo - LON_LEFT) * PX
        M[int(r0):int(r0) + PX, int(c0):int(c0) + PX] = np.round(a).astype(np.int16)
    np.save(path, M)
    return M


def encode(h, path):
    v = np.clip(np.round(h) + ENC_OFFSET, 0, 65535).astype(np.uint16)
    rgb = np.zeros(v.shape + (3,), np.uint8)
    rgb[..., 0] = v >> 8; rgb[..., 1] = v & 255
    Image.fromarray(rgb, 'RGB').save(path, optimize=True)


def route_tree():
    g = load_json(f'{RAW}/route_geom.json')['sections']
    pts = []
    for S in g.values():
        lon, lat = np.array(S['lon']), np.array(S['lat'])
        for i in range(len(lon) - 1):
            n = max(1, int(math.hypot((lon[i + 1] - lon[i]) * 96, (lat[i + 1] - lat[i]) * 111) / 0.1))
            t = np.arange(n) / n
            pts.append(np.c_[lon[i] + (lon[i + 1] - lon[i]) * t, lat[i] + (lat[i + 1] - lat[i]) * t])
        pts.append([[lon[-1], lat[-1]]])
    P = np.vstack(pts)
    return cKDTree(proj(P[:, 0], P[:, 1]))


def proj(lon, lat):
    return np.c_[(np.asarray(lon) - 97.4) * 111.32 * np.cos(np.radians(lat)), np.asarray(lat) * 110.95]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--z2-step', type=int, default=3, choices=(3, 5), help='z2 spacing in arc-seconds')
    ap.add_argument('--out', default=TILES)
    ap.add_argument('--skip-z1', action='store_true')
    a = ap.parse_args()
    t0 = time.time()
    M = mosaic(); print('mosaic', M.shape, f'{time.time() - t0:.0f}s')

    # ---- z1: area-averaged 0.005° grid (every 6th sample of a smoothed mosaic)
    z1_path = f'{RAW}/z1_full.npy'
    if os.path.exists(z1_path):
        Z1 = np.load(z1_path)
    else:
        S = ndimage.uniform_filter(M.astype(np.float32), size=7, mode='nearest')
        Z1 = S[::6, ::6].copy()                         # 1200 x 3000, row k -> lat 33 - k*0.005
        np.save(z1_path, Z1); del S
    os.makedirs(f'{a.out}/z1', exist_ok=True); os.makedirs(f'{a.out}/z2', exist_ok=True)
    z1_tiles = []
    for lat0 in range(int(math.floor(BOX[1])), int(math.ceil(BOX[3]))):
        for lon0 in range(int(math.floor(BOX[0])), int(math.ceil(BOX[2]))):
            ix, iy = lon0 - 90, lat0 - 27
            name = f'{ix}_{iy}'
            k = np.arange(-1, 202)
            rows = np.clip(np.round((LAT_TOP - (lat0 + 1)) / 0.005 + k).astype(int), 0, Z1.shape[0] - 1)
            cols = np.clip(np.round((lon0 - LON_LEFT) / 0.005 + k).astype(int), 0, Z1.shape[1] - 1)
            if not a.skip_z1:
                encode(Z1[np.ix_(rows, cols)], f'{a.out}/z1/{name}.png')
            z1_tiles.append(name)
    print('z1 tiles', len(z1_tiles), f'{time.time() - t0:.0f}s')

    # ---- z2 near the line
    tree = route_tree()
    Z1c = ndimage.spline_filter(Z1.astype(np.float64), order=3, mode='nearest')
    step = a.z2_step / 3600.0
    n = int(round(0.25 / step))
    src = M if a.z2_step == 3 else ndimage.gaussian_filter(M.astype(np.float32), 0.7)
    z2_tiles, kept_area = [], 0
    for iy in range(int((BOX[1] - 27) / 0.25), int(math.ceil((BOX[3] - 27) / 0.25))):
        for ix in range(int((BOX[0] - 90) / 0.25), int(math.ceil((BOX[2] - 90) / 0.25))):
            lon0, lat0 = 90 + ix * 0.25, 27 + iy * 0.25
            # quick reject: distance from tile centre
            dc, _ = tree.query(proj([lon0 + 0.125], [lat0 + 0.125])[0])
            if dc > CORRIDOR_KM + BLEND_KM + 19:
                continue
            k = np.arange(-1, n + 2)
            lon = lon0 + k * step
            lat = lat0 + 0.25 - k * step
            LON, LAT = np.meshgrid(lon, lat)
            d, _ = tree.query(proj(LON.ravel(), LAT.ravel()))
            d = d.reshape(LON.shape)
            inner = (LON >= BOX[0]) & (LON <= BOX[2]) & (LAT >= BOX[1]) & (LAT <= BOX[3])
            if not ((d < CORRIDOR_KM + BLEND_KM) & inner).any():
                continue
            if a.z2_step == 3:
                rr = np.clip(np.round((LAT_TOP - lat) * PX).astype(int), 0, ROWS - 1)
                cc = np.clip(np.round((lon - LON_LEFT) * PX).astype(int), 0, COLS - 1)
                fine = M[np.ix_(rr, cc)].astype(np.float32)
            else:
                fine = ndimage.map_coordinates(src, [(LAT_TOP - LAT) * PX, (LON - LON_LEFT) * PX], order=1, mode='nearest')
            # cubic spline of the 500 m grid: bilinear would leave faceted 500 m blocks in the shading
            coarse = ndimage.map_coordinates(Z1c, [(LAT_TOP - LAT) / 0.005, (LON - LON_LEFT) / 0.005], order=3, mode='nearest', prefilter=False)
            w = np.clip((CORRIDOR_KM + BLEND_KM - d) / BLEND_KM, 0, 1)
            w = w * w * (3 - 2 * w)
            h = coarse + (fine - coarse) * w
            name = f'{ix}_{iy}'
            encode(h, f'{a.out}/z2/{name}.png')
            z2_tiles.append(name); kept_area += float((d < CORRIDOR_KM).mean())
    print('z2 tiles', len(z2_tiles), f'{time.time() - t0:.0f}s')
    if a.out == TILES:
        dump_json({'enc': {'offset': ENC_OFFSET, 'pad': 1},
                   'z1': {'size': 1.0, 'n': 200, 'tiles': z1_tiles},
                   'z2': {'size': 0.25, 'n': n, 'step': a.z2_step, 'tiles': z2_tiles}}, f'{DATA}/tiles.json')


if __name__ == '__main__':
    main()
