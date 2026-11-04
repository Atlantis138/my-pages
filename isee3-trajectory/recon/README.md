# 轨道重建脚本

- `isee3.src.html`：页面模板，`/*MODEL*/` 填 `model.json`（日心段参数），`/*TRACK*/` 填 `track.json`（地月段与 2014 段轨迹）。
- `data.py`：NSSDC 实测 GSE 锚点；`dyn.py`：日地月引力模型与多重打靶；`part1.py`、`geotail.py`、`final_*.py`、`escape.py`：分段求解；`export2.py`：导出 `track.json`。
- 待办：用完整的 `isee3_dp_ephem.asc`（逐小时 GSE 星历）替换 1983 年 4—9 月的推测段。
