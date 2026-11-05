# 川藏铁路三维图志

在建川藏铁路（成都—雅安—林芝—拉萨）的三维交互图志：OSM 实际线位、推算轨面高程、多精度地形与沿线专题图层。

## 数据来源与许可

- **线位、车站、桥梁、隧道，河流与湖泊**：© [OpenStreetMap](https://www.openstreetmap.org/copyright) 贡献者，ODbL 许可。标注为 preliminary 的路段在图上显示为“粗略”。
- **国界**：[Natural Earth](https://www.naturalearthdata.com/) 1:1000万边界（公有领域）。按中国政府主张的国界线绘制。
- **地形**：[Copernicus DEM GLO-90](https://spacedata.copernicus.eu/collections/copernicus-digital-elevation-model)（© DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018 provided under COPERNICUS by the European Union and ESA; all rights reserved），重采样为约 500 m 全图和约 90 m 线路两侧 15 km 两级瓦片；全线底图为 GEBCO 2024（约 5 km）。
- **轨面高程**：按地形和 30‰ 坡度上限推算，并用大渡河特大桥（1,681.48 m）、金沙江特大桥（约 3,000 m）校准，并非设计值。
- 植被、地质、断层、行政界线及文字资料的出处见页面“来源”页。

## 重新生成数据

```bash
pip install numpy scipy pillow rasterio osqp shapely
cd sichuan-tibet-railway
OVERPASS_URL=https://overpass-api.de/api/interpreter python scripts/fetch_osm.py   # 线位（可换其他 Overpass 端点）
python scripts/fetch_dem.py        # Copernicus 瓦片 → raw/（约 430 MB，不提交）
python scripts/build_route.py      # 拼接成雅、雅林、拉林三段线位
python scripts/build_terrain.py    # tiles/z1、tiles/z2（--z2-step 5 生成 150 m 版）
python scripts/build_profile.py    # 推算轨面高程 → data/route.json
OVERPASS_URL=… python scripts/fetch_water.py   # OSM 河流与水面 → raw/（约 90 MB，不提交）
python scripts/build_water.py      # 河网分级与简化 → data/rivers.json；湖泊距离场 → data/water.png
python scripts/build_borders.py    # Natural Earth 国界 → data/borders.json
python scripts/build_kml.py        # 线位、桥隧、车站 → export/sichuan-tibet-railway.kml（可导入 Google Earth）
```

`data/atlas.json` 是人工整理的文字与专题数据；`scripts/extract_legacy.py` 是从旧版单文件页面拆出数据时用的一次性脚本。页面需通过 HTTP 访问（如在仓库根目录运行 `python -m http.server`）。
