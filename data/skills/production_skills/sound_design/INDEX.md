---
name: sound-design-index
description: 声音设计原子Skills路由 — 声画分类/听觉层级/声能模型/聆听模式/声音引导/对比戏剧/一致性/少即是多 等13项技能
type: production_skill_index
---

# Sound Design — 声音设计原子 Skills

> 来源：《声音设计》David Sonnenschein
> 综合参考：[sound_design_basics.md](../sound_design_basics.md)

## Skill 路由表

### 声音叙事功能

| 触发信号 | 路由到 |
|----------|--------|
| "画内/画外声音"、"声源要不要出现"、"幻听"、"非剧情声音" | [sound-design-diegetic-taxonomy](sound-design-diegetic-taxonomy/SKILL.md) |
| "奏鸣曲式"、"声音结构"、"声音叙事弧" | [sound-design-sonata-drama](sound-design-sonata-drama/SKILL.md) |
| "音乐独立叙事"、"音乐和画面平行"、"对位" | [sound-design-music-story-parallel](sound-design-music-story-parallel/SKILL.md) |

### 心理声学

| 触发信号 | 路由到 |
|----------|--------|
| "观众怎么听"、"简化聆听/因果聆听/语义聆听" | [sound-design-listening-modes](sound-design-listening-modes/SKILL.md) |
| "声音催眠"、"心跳同步"、"节奏引导生理" | [sound-design-entrainment](sound-design-entrainment/SKILL.md) |
| "预期操控"、"声音惊喜/惊吓"、"打破听觉预期" | [sound-design-expectation](sound-design-expectation/SKILL.md) |

### 混音与层级

| 触发信号 | 路由到 |
|----------|--------|
| "声音层次"、"前景/背景声音"、"对白和音效冲突" | [sound-design-auditory-hierarchy](sound-design-auditory-hierarchy/SKILL.md) |
| "声音能量"、"物理层/情绪层/智力层/道德层" | [sound-design-energy-model](sound-design-energy-model/SKILL.md) |
| "声音对比"、"吵/静转换"、"有序→混乱" | [sound-design-contrast-drama](sound-design-contrast-drama/SKILL.md) |
| "空间感"、"声音大小暗示空间尺寸" | [sound-design-size-control](sound-design-size-control/SKILL.md) |

### 声音设计原则

| 触发信号 | 路由到 |
|----------|--------|
| "声音一致性"、"声音世界的连贯性"、"不跳戏" | [sound-design-consistency](sound-design-consistency/SKILL.md) |
| "少即是多"、"声音减法"、"静默的力量" | [sound-design-less-is-more](sound-design-less-is-more/SKILL.md) |
| "画音同步"、"同步错觉"、"声音让画面更流畅" | [sound-design-sync-illusion](sound-design-sync-illusion/SKILL.md) |

## 依赖图

```
diegetic-taxonomy ──→ auditory-hierarchy
                  ──→ sonata-drama
listening-modes   ──→ auditory-hierarchy
                  ──→ entrainment
                  ──→ expectation
energy-model      ──→ contrast-drama
                  ──→ size-control
consistency       ──→ auditory-hierarchy
less-is-more      ──→ contrast-drama
sync-illusion     ──→ entrainment
music-story-parallel ──→ sonata-drama
```
