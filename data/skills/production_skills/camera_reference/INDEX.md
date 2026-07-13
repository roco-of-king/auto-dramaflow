---
name: camera-reference-index
description: 摄影机镜头审美锚定库路由 — 具体设备型号 > 空泛形容词，11种美学风格×设备组合速查
type: production_skill_index
---

# Camera Reference — 摄影机镜头审美锚定库

> 来源：跨书综合（cinematography-brown + color-grading + ai-shortfilm-prompts 方法论 + 行业实践）
> 核心原则：**"shot on ARRI Alexa + Cooke S4 50mm" 比 "电影质感" 有效 10 倍**

## Skill 路由表

| 触发信号 | 路由到 |
|----------|--------|
| "用什么摄影机/镜头"、"电影感/胶片感"、"画质风格"、"像XX电影"、"AI视频prompt怎么写" | [camera-lens-anchoring](camera-lens-anchoring/SKILL.md) |

## 三层锚定体系

1. **摄影机** → 色彩科学、宽容度、噪点特征
2. **镜头** → 焦外质感、色散、畸变风格
3. **胶片/色彩** → 颗粒感、饱和度、色调倾向

## AI 模型响应差异（2025-2026 实测）

| 模型 | 最佳锚定策略 |
|------|-------------|
| Sora / Veo 2 | 摄影机名称响应最强，"shot on ARRI Alexa" 可靠产出电影感肤色 |
| Seedance / Kling | 焦距描述（"35mm" vs "85mm"）比具体型号更有效 |
| 所有模型通用 | 镜头焦距 > 摄影机型号 > 泛泛形容词 |

## AI prompt 黄金公式

```
shot on [摄影机], [镜头品牌+焦段], [胶片/色彩]
例：shot on ARRI Alexa 35, Cooke S4 50mm, Kodak Vision3 500T
```
