---
name: scene-transitions-index
description: 场景转换原子Skills路由 — 四功能诊断/二元对立/天气对比/音乐四象限/低潮原则/忠诚转移/同步节点/末节诊断 等9项技能
type: production_skill_index
---

# Scene Transitions — 场景转换原子 Skills

> 来源：《大师场景：顶级场景转换术》Jeffrey Michael Bays
> 综合参考：[scene_transitions.md](../scene_transitions.md)

## Skill 路由表

### 决策框架

| 触发信号 | 路由到 |
|----------|--------|
| "场景转换应该怎么做"、"转场风格"、"过场动画"、"这段转场不对" | [scene-transition-four-function-diagnosis](scene-transition-four-function-diagnosis/SKILL.md) |
| "这段要不要删"、"场景是不是多余的"、"末节场景" | [scene-transition-caboose-diagnosis](scene-transition-caboose-diagnosis/SKILL.md) |

### 视觉技法

| 触发信号 | 路由到 |
|----------|--------|
| "场景对比"、"二元对立"、"场所选择"、"转换太平了" | [scene-transition-binary-opposition](scene-transition-binary-opposition/SKILL.md) |
| "天气配合情绪太老套"、"天气对比"、"反直觉天气" | [scene-transition-weather-contrast](scene-transition-weather-contrast/SKILL.md) |

### 节奏与休息

| 触发信号 | 路由到 |
|----------|--------|
| "节奏太快需要喘息"、"低潮段"、"观众需要休息" | [scene-transition-low-point-no-plot](scene-transition-low-point-no-plot/SKILL.md) |
| "长转换不拖沓"、"无缝休息"、"观众不知道在休息" | [scene-transition-seamless-pause](scene-transition-seamless-pause/SKILL.md) |

### 音频策略

| 触发信号 | 路由到 |
|----------|--------|
| "转换用什么音乐"、"静默还是配乐"、"音频策略" | [scene-transition-music-quadrant](scene-transition-music-quadrant/SKILL.md) |

### 叙事连接

| 触发信号 | 路由到 |
|----------|--------|
| "怎么让观众喜欢新角色"、"角色认同转换"、"忠诚转移" | [scene-transition-loyalty-transfer](scene-transition-loyalty-transfer/SKILL.md) |
| "多线叙事怎么交汇"、"故事线连接点"、"同步节点" | [scene-transition-synch-node](scene-transition-synch-node/SKILL.md) |

## 依赖图

```
four-function-diagnosis ──→ binary-opposition
                        ──→ weather-contrast
                        ──→ music-quadrant
                        ──→ low-point-no-plot
                        ──→ seamless-pause
                        ──→ loyalty-transfer
                        ──→ synch-node
                        ──→ caboose-diagnosis
```
