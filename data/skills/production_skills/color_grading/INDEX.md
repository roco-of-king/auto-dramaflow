---
name: color-grading-index
description: 调色原子Skills路由 — 一级校色/对比度优先/记忆色彩/肤色示波器/镜头匹配/Look开发 等11项技能
type: production_skill_index
---

# Color Grading — 调色原子 Skills

> 来源：《调色师手册》第2版 Alexis Van Hurkman
> 综合参考：[hollywood_color_grading.md](../hollywood_color_grading.md)

## Skill 路由表

### 核心工作流

| 触发信号 | 路由到 |
|----------|--------|
| "怎么调色"、"画面灰/平淡"、"偏色"、"一级校色" | [color-grading-primary-workflow](color-grading-primary-workflow/SKILL.md) |
| "先调什么"、"改了对比度色彩又变了"、"调色顺序" | [color-grading-contrast-before-color](color-grading-contrast-before-color/SKILL.md) |
| "Log素材"、"S-Log/V-Log/C-Log调色"、"灰度素材" | [color-grading-log-workflow](color-grading-log-workflow/SKILL.md) |
| "镜头颜色不一致/跳色"、"场景匹配"、"多机位" | [color-grading-shot-matching](color-grading-shot-matching/SKILL.md) |

### 色彩科学

| 触发信号 | 路由到 |
|----------|--------|
| "色温"、"偏暖/偏冷"、"开尔文"、"白平衡" | [color-grading-color-temperature](color-grading-color-temperature/SKILL.md) |
| "对比度和饱和度关系"、"调了对比度饱和度变了"、"RGB联动" | [color-grading-contrast-saturation](color-grading-contrast-saturation/SKILL.md) |
| "肤色/天空/植物颜色不对"、"记忆色彩"、"画面不自然" | [color-grading-memory-colors](color-grading-memory-colors/SKILL.md) |
| "肤色偏黄/偏绿/偏红"、"矢量示波器"、"肤色线I-bar" | [color-grading-skin-tone-vectorscope](color-grading-skin-tone-vectorscope/SKILL.md) |

### 专业技巧与风格

| 触发信号 | 路由到 |
|----------|--------|
| "过曝了怎么办"、"高光溢出修复"、"通道混合器" | [color-grading-overexposure-recovery](color-grading-overexposure-recovery/SKILL.md) |
| "滤镜效果"、"光学滤镜模拟"、"非线性着色" | [color-grading-filter-nonlinear](color-grading-filter-nonlinear/SKILL.md) |
| "想要一个Look/风格"、"像XX电影那样的调色"、"复古/漂白" | [color-grading-look-development](color-grading-look-development/SKILL.md) |

## 依赖图

```
primary-workflow ──→ contrast-before-color
                 ──→ log-workflow
                 ──→ color-temperature
                 ──→ contrast-saturation
                 ──→ memory-colors
                 ──→ skin-tone-vectorscope
                 ──→ shot-matching
                 ──→ look-development
overexposure-recovery ──→ primary-workflow
filter-nonlinear ──→ look-development
```
