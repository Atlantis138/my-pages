"""Download Copernicus DEM GLO-90 tiles (N27–N32, E090–E104) into raw/cop90/ (public AWS bucket, no key).

Copernicus DEM: © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under
COPERNICUS by the European Union and ESA; all rights reserved.
"""
import os, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
from common import RAW

BASE = 'https://copernicus-dem-90m.s3.amazonaws.com'


def get(name):
    path = f'{RAW}/cop90/{name}.tif'
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return name, 'cached'
    try:
        urllib.request.urlretrieve(f'{BASE}/{name}/{name}.tif', path + '.part')
        os.replace(path + '.part', path)
        return name, 'ok'
    except Exception as e:
        return name, f'failed: {e}'


def main():
    os.makedirs(f'{RAW}/cop90', exist_ok=True)
    names = [f'Copernicus_DSM_COG_30_N{la:02d}_00_E{lo:03d}_00_DEM' for la in range(27, 33) for lo in range(90, 105)]
    with ThreadPoolExecutor(8) as ex:
        bad = [r for r in ex.map(get, names) if r[1].startswith('failed')]
    print(len(names) - len(bad), 'tiles ready')
    if bad:
        sys.exit('\n'.join(f'{n}: {s}' for n, s in bad))


if __name__ == '__main__':
    main()
