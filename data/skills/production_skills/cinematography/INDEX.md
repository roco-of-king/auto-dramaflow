---
name: cinematography-index
description: 电影摄影原子Skills路由 — 三点布光/硬光软光/灯光方向情绪/叠光/180度法则/主场景法/区域曝光 7项技能
type: production_skill_index
---

# Cinematography — 电影摄影原子 Skills

> 来源：《电影摄影：理论与实践》Blain Brown（第2版）
> 综合参考：[cinematography_lighting.md](../cinematography_lighting.md)

## Skill 路由表

| 触发信号 | 路由到 |
|----------|--------|
| "怎么布光"、"三点照明"、"主光/补光/背光"、"灯光比" | [cinematography-three-point-lighting](cinematography-three-point-lighting/SKILL.md) |
| "硬光/软光"、"阴影太硬"、"柔光"、"光源大小" | [cinematography-hard-soft-light](cinematography-hard-soft-light/SKILL.md) |
| "灯光方向"、"侧光/背光"、"戏剧性灯光"、"神秘感" | [cinematography-light-direction-mood](cinematography-light-direction-mood/SKILL.md) |
| "从后面打光"、"叠光"、"台灯/窗户照亮演员"、真实光源不够亮 | [cinematography-back-lighting](cinematography-back-lighting/SKILL.md) |
| "180度法则"、"轴线"、"跳轴"、"画面方向反转" | [cinematography-180-degree-rule](cinematography-180-degree-rule/SKILL.md) |
| "主场景法"、"先拍什么"、"覆盖策略"、"镜头顺序" | [cinematography-master-scene](cinematography-master-scene/SKILL.md) |
| "分区曝光"、"Zone System"、"第V区"、"中灰18%" | [cinematography-zone-system](cinematography-zone-system/SKILL.md) |

## 依赖图

```
three-point-lighting ──→ hard-soft-light
       │              ──→ light-direction-mood
       │              ──→ back-lighting
       │
master-scene ──→ 180-degree-rule
zone-system  ──→ three-point-lighting
```

## 推荐学习顺序

1. three-point-lighting → 最基础的灯光系统
2. hard-soft-light → 灯光品质决策
3. light-direction-mood → 方向与情绪
4. back-lighting → 从后场打光
5. zone-system → 曝光控制
6. 180-degree-rule → 空间连续性
7. master-scene → 覆盖策略
