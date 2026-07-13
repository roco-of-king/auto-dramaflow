---
name: 3D游戏电影化-导演分镜
description: 游戏电影化风格的分镜提示词结构指南，涵盖摄像机类型、HUD元素、材质质量等级与光照引擎选择
metaData:
  style: "3D_game_cinematic"
  artStyle: "游戏电影化风格"
  category: "director_storyboard"
  tags: ["分镜", "游戏截图", "摄像机", "HUD", "光照", "游戏类型"]
---

# 导演分镜 - 3D游戏电影化

## 游戏截图提示词结构

生成游戏电影化风格截图时，每个提示词必须包含以下要素：

### 1. 摄像机类型
- `over-the-shoulder` — 第三人称过肩，适用于动作RPG/黑暗奇幻/赛博朋克
- `isometric-tactical` — 等距战术视角，适用于策略类/低多边形/像素RPG
- `side-scrolling` — 横向卷轴，适用于像素艺术/2.5D平台
- `top-down` — 俯视，适用于策略类/复古RPG
- `cinematic-flyover` — 电影化飞越，适用于过场动画/环境展示

### 2. HUD元素
- 必须指定HUD类型：`diegetic` / `non-diegetic` / `hybrid`
- 必需HUD组件（根据游戏类型选择）：生命条(HP bar)、小地图(mini-map)、技能栏(skill bar)、目标指示器(quest marker)、弹药计数(ammo counter)
- HUD风格描述词：`polished AAA game HUD`、`minimalist indie HUD`、`retro pixel UI frame`

### 3. 材质质量等级
- `photoreal-AAA` — PBR材质，实时光追，4K贴图
- `stylized-indie` — 手绘贴图，程序化材质，风格化
- `pixel-retro` — 限量色盘，像素精确，可能含CRT效果
- `low-poly` — 低面数模型，平坦着色，干净几何体

### 4. 光照引擎
- `real-time-ray-traced` — 实时光追（AAA黑暗奇幻/赛博朋克）
- `baked-global-illumination` — 烘焙GI（风格化/独立游戏）
- `dynamic-time-of-day` — 动态昼夜系统
- `pixel-lighting` — 像素级光照（复古风格）
- `vertex-lighting` — 顶点光照（低多边形/复古3D）

## 游戏类型专用词汇

### RPG类
- inventory screen, character stat overlay, quest log, dialogue wheel, skill tree UI
- party frame, buff/debuff icons, XP bar, level-up notification

### FPS类
- crosshair, ammo counter, health bar, minimap radar, grenade indicator
- hit marker, kill feed, scoreboard, weapon wheel

### 策略类
- hex grid, unit card, resource counter, build queue, tech tree
- fog of war, selection box, command panel, turn counter

### 像素艺术类
- sprite sheet aesthetic, pixel-perfect rendering, limited color palette, dithering
- CRT scanlines, 16-bit era UI frame, bitmap font HUD
