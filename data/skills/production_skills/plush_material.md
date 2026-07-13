---
name: plush_material
description: 毛绒玩偶质感规范——将2D角色/物品转为3D毛绒织物纹理，含绒毛长度/密度/柔软度参数
type: production_skill
---
# 毛绒玩偶质感

## 材质参数

| 参数 | 范围 | 说明 |
|------|------|------|
| 绒毛长度 | 3-15mm | 越短越精致，越长越毛茸 |
| 毛发密度 | 5000-15000根/cm² | 密度越高越细腻 |
| 柔软度系数 | 0.3-0.8 | 影响弯曲和塌陷效果 |
| 颜色保真度 | ≥90% | 保持原图色彩还原度 |

## 输出规格

| 参数 | 建议值 |
|------|--------|
| 分辨率 | 2048×2048（标准商品图） |
| 格式 | PNG 透明背景 |
| 视角 | 正面、45度角、俯视三视图 |
| 光照 | 柔和产品摄影光（三点布光） |

## 玩偶细节

- 缝线：可见但不抢眼，颜色与面料协调
- 标签：小面积织物标签，非水印/logo
- 纽扣：木质或塑料质感，有厚度
- 填充感：形体饱满，有重力感（坐下时自然压扁）

## Prompt 模板

```
3D plush toy render, soft plush fabric texture,
[绒毛长度]mm pile height, [柔软度描述] softness,
button eyes, stitched seams visible,
soft product photography lighting, three-point lighting,
solid color background, product shot,
high quality toy photography, 2048x2048
```

## 适用场景
- 角色IP衍生品预览
- 商品化设计展示
- 治愈系/萌系短剧的角色形象软化
