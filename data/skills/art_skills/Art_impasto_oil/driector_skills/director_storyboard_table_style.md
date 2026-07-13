---
name: director_storyboard_table_style
description: 厚涂油画风格的分镜表格样式指南，定义分镜序列中的画布统一性、场景间视觉过渡、以及基于五种核心颜料的全局色彩一致性规则。
metaData: director_skills
---

# 厚涂油画分镜表格样式

## 画布统一性原则

### 建立镜头：所有场景共享的纹理画布基底

每一个分镜的第一帧必须建立相同的物理画布存在感。这不是一个可选的视觉效果——它是所有后续镜头赖以存在的物质基础。

```
建立镜头模板：
Extreme close-up on oil-primed linen canvas surface. The weave is visible—horizontal and vertical threads creating a regular grid texture. The canvas is toned with a thin wash of Burnt Sienna, the neutral ground showing through in areas of thin paint application. This canvas ground is the constant visual substrate across every shot in the sequence.
```

### 画布基底的连续性规则

| 规则 | 说明 |
|------|------|
| 画布纹理一致性 | 所有镜头使用相同的画布经纬纹理密度和方向 |
| 底色一致性 | 所有镜头的薄涂区域露出相同的 Burnt Sienna 底色 |
| 颜料覆盖度 | 每个镜头至少保留 15% 的画布可见区域（薄涂或留白） |
| 边缘处理 | 所有镜头边缘保留不规则的颜料边界，模拟真实油画布的边缘 |

---

## 全局色彩统一规则

### 五种核心颜料

所有场景共享同一组五种核心颜料。不允许引入额外颜色。所有颜色变化必须通过这五种颜料的混合、稀释、叠加产生。

| 颜料名称 | 英文 | 色相 | 角色 |
|---------|------|------|------|
| 铬黄 | Chrome Yellow | 暖黄 | 光源色、高光、暖调区域 |
| 深群青 | Deep Ultramarine | 冷蓝 | 阴影、冷调区域、天空深层 |
| 朱红 | Vermilion Red | 暖红 | 焦点强调、暖调补色、生命感 |
| 翠绿 | Viridian Green | 冷绿 | 植被、冷调补色、阴影中的绿色 |
| 熟赭 | Burnt Sienna | 暖棕 | 底色、大地、过渡色调 |

### 色彩配比规则

```
场景色彩配比 = 主导色 40% + 次要色 30% + 补色 20% + 强调色 10%

示例配比：
- 日间风景：Chrome Yellow 40% + Viridian Green 30% + Deep Ultramarine 20% + Vermilion Red 10%（Burnt Sienna 作为基底不计入配比）
- 室内场景：Burnt Sienna 40% + Deep Ultramarine 30% + Chrome Yellow 20% + Vermilion Red 10%
- 夜景：Deep Ultramarine 40% + Viridian Green 30% + Burnt Sienna 20% + Chrome Yellow 10%（Vermilion Red 保留用于关键强调）
```

### 场景间色彩过渡

当分镜序列跨越不同时间/地点时，色彩过渡必须通过油画技法实现：

1. **时间推移（日→夜）**：Chrome Yellow 比例递减，Deep Ultramarine 比例递增。过渡镜头中使用 Scumbling 技法——黄底上薄擦蓝色，产生冷色珍珠光泽。
2. **空间转移（室内→室外）**：Burnt Sienna 暖棕调过渡为 Viridian Green 冷绿调。过渡镜头中使用 Broken color——棕绿短笔触并置。
3. **情绪转变（平静→激烈）**：Vermilion Red 从 10% 逐渐增加到 30%。过渡镜头中使用 Alla prima 湿画湿直接混合。

---

## 分镜表格结构

### 标准分镜行

| 镜号 | 时长 | 景别 | 画面描述 | 技法组合 | 颜料厚度分布 | 主导色（40%） | 次要色（30%） | 补色（20%） | 强调色（10%） |
|------|------|------|---------|---------|-------------|-------------|-------------|-----------|-------------|
| 01 | 5s | 特写 | 画布基底建立 | 薄涂打底 | 全薄-画布可见 | Burnt Sienna | — | — | — |
| 02 | 7s | 全景 | 天空与远山 | 薄涂+断色 | 背景薄/前景中 | Chrome Yellow | Viridian Green | Deep Ultramarine | Vermilion Red |
| 03 | 8s | 中景 | 角色登场 | 前景厚涂+中景断色 | 前景厚/中景中/背景薄 | Deep Ultramarine | Chrome Yellow | Viridian Green | Vermilion Red |
| 04 | 6s | 近景 | 角色表情细节 | 全厚涂 | 全部最厚 | Burnt Sienna | Deep Ultramarine | Chrome Yellow | Vermilion Red |
| 05 | 10s | 全景 | 场景收束 | 厚度递减回归 | 前中/中薄/后极薄 | Chrome Yellow | Viridian Green | Deep Ultramarine | Vermilion Red |

### 颜料厚度分布图例

```
厚度级别：
████  最厚（Impasto + Palette knife）  — 前景焦点
███   厚（Bristle brush visible strokes）— 中景叙事
██    中（Broken color dabs）           — 过渡区域
█     薄（Scumbling / Glazing）         — 背景后退
·     极薄（Canvas visible）            — 天空/留白/基底
```

---

## 分镜序列设计原则

### 开篇画布建立

每个序列必须以对画布基底的确认开始。这不仅是视觉惯例，也是物理真实性的锚点——提醒观众他们正在观看一幅真实的油画。

### 颜料厚度叙事弧线

分镜序列中的颜料厚度应遵循叙事弧线：

```
开篇：薄 → 建立环境（Scumbling 天空、远景）
发展：渐厚 → 角色入场（Bristle brush 中景）
高潮：最厚 → 冲突/情感顶点（Impasto + Palette knife 全画面前景）
回落：渐薄 → 解决/收束（厚度递减，回归画布基底）
结尾：极薄 → 回归画布（Canvas visible，安静退场）
```

### 禁止的视觉跳跃

- 禁止相邻镜头之间颜料厚度突变超过两个级别（如从极薄突然跳到最厚）
- 禁止相邻镜头之间主导色完全切换（如从 40% Chrome Yellow 跳到 40% Deep Ultramarine）
- 禁止在连续镜头中改变画布纹理的可见密度
