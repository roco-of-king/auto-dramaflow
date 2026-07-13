---
name: director_storyboard
description: 厚涂油画风格的分镜提示词结构指南，定义从文字描述到油画画面的提示词构建规范，包含完整的技法词汇表和分镜指令模板。
metaData: director_skills
---

# 厚涂油画分镜提示词结构

## 分镜提示词构建流程

每一条分镜提示词按以下五层结构构建：

```
[1. 画布基础] → [2. 技法定义] → [3. 内容描述] → [4. 灯光与色彩] → [5. 运动指令（视频分镜）]
```

---

## 第一层：画布基础

定义物理画布的存在和质量。所有厚涂油画画面必须始于对画布物质性的声明。

```
Oil on linen canvas. Visible canvas weave throughout. Paint applied with physical brushes and palette knives—no digital effects, no CGI blending.
```

## 第二层：技法定义

从以下词库中选择适合场景的技法组合：

### 厚涂技法词库

| 英文术语 | 中文 | 视觉效果 | 使用场景 |
|---------|------|---------|---------|
| Impasto | 厚涂 | 颜料堆积形成立体浮雕，刀痕和笔触清晰可见 | 前景、主体、焦点区域 |
| Palette knife | 调色刀 | 扁平金属刀留下的平滑但有纹理的笔触，颜料边缘锋利 | 建筑、几何形体、大面积色块 |
| Bristle brush | 鬃毛笔 | 粗糙的笔触纹理，可见的刷毛痕迹 | 中景、人物、有机形体 |
| Scumbling | 薄涂擦 | 少量浅色颜料在干燥深色底上轻擦，底层透出 | 大气、远山、天空光效 |
| Glazing | 透明罩染 | 透明的深色薄层覆盖在浅色底上，宝石般深邃 | 阴影区域、水的深度、夜景 |
| Broken color | 断色 | 互补色短笔触并置，远处形成光学混合 | 印象派场景、水波、树叶 |
| Alla prima | 直接画法 | 湿画湿，颜料在现场混合，笔触充满活力 | 快速写生、动态场景、人物速写 |
| Sgraffito | 刮画 | 在湿颜料上刮出线条，露出底层颜色 | 树枝、草叶、细线细节 |

### 技法组合示例

```
前景采用厚涂（Impasto）+ 调色刀（Palette knife），中景采用鬃毛笔断色（Bristle brush broken color），背景采用薄涂擦（Scumbling）罩染（Glazing）叠加。
```

## 第三层：内容描述

从 `art_character.md`、`art_prop.md`、`art_scene.md` 中引用对应的内容描述。

## 第四层：灯光与色彩

```json
{
  "light": {
    "source": "overhead midday sun / diagonal afternoon / golden hour side / diffuse overcast / crucible glow from below",
    "quality": "harsh with deep ridge shadows / soft with hazy diffusion / warm wrapping glow",
    "direction": "from top-left / from right / from below / frontal"
  },
  "color": {
    "palette": ["Chrome Yellow", "Deep Ultramarine", "Vermilion Red", "Viridian Green", "Burnt Sienna"],
    "dominance": "warm-forward / cool-recede / balanced",
    "technique": "physical palette mixing / optical broken color / scumble overlay / glaze depth"
  }
}
```

## 第五层：运动指令（仅视频分镜）

```
Motion: Paint slowly flowing and breathing along brushstroke direction. Palette knife ridges pulse with subtle expansion and contraction. Shadows shift within paint valleys as the light angle slowly changes. No digital smoothness—every motion respects the physical viscosity of oil paint. Swirling motion in sky and water, gentle breathing motion in figures and still objects. Canvas weave remains static—the motion is in the paint, not the substrate.
```

---

## 完整分镜提示词示例

### 静态分镜

```
Oil on linen canvas. Visible canvas weave throughout. Foreground rendered in heavy impasto with palette knife strokes creating 3D ridges. Midground in bristle brush broken color with short horizontal dabs. Background in thinned scumbling with canvas clearly visible. A woman in a flowing blue dress stands at a riverside, the wind catching her skirt. Harsh midday sunlight from overhead creates deep shadows within the paint ridges of her figure. Color palette: Chrome Yellow in the sky reflection, Deep Ultramarine in dress shadows, Vermilion Red in her lips, Viridian Green in the riverbank vegetation, Burnt Sienna in the earth. Optical mixing through broken color in the middle distance. In the tradition of post-impressionist impasto oil painting.
```

### 动态分镜（视频）

```
Post-impressionist oil painting animation. Oil on linen canvas with visible weave. Palette knife impasto creating 3D paint topography. Motion: sky swirling slowly along brushstroke direction like Van Gogh Starry Night. River flowing in horizontal impasto ridges. Figure breathing gently—paint of her form pulsing along body contours. Deep shadows shifting within paint valleys as implied light moves. Color palette: Chrome Yellow, Deep Ultramarine, Vermilion Red, Viridian Green, Burnt Sienna. No CGI blending, no digital smoothness—all motion respects the physical resistance and viscosity of oil paint on canvas.
```

---

## 技法选用决策树

```
场景需要突出主体？
├── 是 → 主体使用 Impasto + Palette knife（最厚）
│   └── 背景使用 Scumbling（最薄）以形成厚度对比
└── 否 → 全场景使用 Bristle brush + Broken color（均匀厚度）

场景需要朦胧氛围？
├── 是 → 全场景使用 Broken color + Scumbling
│   └── 限制 Impasto 仅用于最小的高光点
└── 否 → 正常厚度分布

场景需要戏剧性光影？
├── 是 → Impasto 刀痕最大化 + Harsh overhead light
└── 否 → Scumbling 柔光 + Diffuse overcast light

场景是夜景？
├── 是 → Glazing 为主 + 少量 Impasto 高光
└── 否 → 正常日间技法分布
```
