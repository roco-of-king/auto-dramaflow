---
name: seedance_prompt_patterns
description: Seedance 2.0 视频提示词实战范例库——按风格收集自 awesome-seedance 社区验证通过的高质量 prompt 模板，含时间编码多镜头序列
type: production_skill
---
# Seedance 2.0 视频提示词实战范例库

> 来源：[awesome-seedance](https://github.com/ZeroLu/awesome-seedance)，社区验证通过的高质量 prompt

## 时间编码多镜头序列模版

Seedance 2.0 最佳实践——将 15s 视频拆为 3-4 个带精确时间编码的镜头：

```
Style: [风格标签].
Duration: [总时长]s.

[00-05s] Shot 1: [景别]. [场景]. [动作]. [情绪].
[05-10s] Shot 2: [景别]. [镜头运动]. [转折]. [情绪升级].
[10-15s] Shot 3: [景别]. [高潮]. [收尾].
```

## 各风格 prompt 长度基准

| 风格 | 单镜头描述长度 | 总 prompt 词数 |
|------|-------------|--------------|
| 电影史诗 | 40-70 词/镜头 | 200-400 词 |
| 短剧情感 | 30-50 词/镜头（中文） | 150-300 词 |
| 动画动作 | 20-40 词/镜头 | 100-250 词 |
| UGC/Vlog | 25-50 词/镜头 | 150-300 词 |

## 已验证的高命中关键词

### 运镜
`static tripod`, `slow dolly forward`, `dolly zoom`, `whip pan`, `sweeping crane shot`, `snap cut`, `seamless morph`, `tracking shot`, `handheld`, `slow motion`

### 光影
`volumetric lighting`, `god rays`, `chiaroscuro`, `neon reflections`, `practical lighting`, `atmospheric haze`, `golden hour`, `orange-teal color grading`, `crushed blacks`, `soft diffused light`

### 质感
`hyper-realistic`, `8k`, `cinematic wide shot`, `film grain`, `anamorphic lens`, `IMAX quality`, `shallow depth of field`, `motion blur`

### 情绪摄影风格词
`Wong Kar-wai style`（忧郁暖黄）, `Denis Villeneuve style`（史诗冷峻）, `Blade Runner 2049 cinematography`（新黑色）, `Akira Kurosawa cinematography`（武士史诗）, `Wes Anderson style`（对称童话）, `Michael Mann cinematography`（写实动作）
