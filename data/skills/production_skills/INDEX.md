---
name: production_skills_index
description: 制作技法库主路由索引 — 8大领域（灯光摄影/调色/镜头设计/场景转换/声音设计/摄影机锚定/导演技艺/故事结构）的触发信号→子域路由映射
type: production_skill_index
---

# Production Skills — 主路由索引

> 本文件由 Agent 系统自动加载。通过 `activate_production_skill` 工具按需激活具体技能。
> 使用方法：匹配触发信号 → 找到对应子域 INDEX → 激活目标 skill。

## 域路由

| 触发信号关键词 | 子域 | 路由索引 |
|---------------|------|----------|
| 灯光/布光/主光/补光/背光/硬光/软光/灯光方向/曝光/180度/轴线/主场景 | cinematography | [cinematography/INDEX.md](cinematography/INDEX.md) |
| 调色/校色/色彩/肤色/饱和度/对比度/偏色/Look/LUT/示波器/镜头匹配 | color_grading | [color_grading/INDEX.md](color_grading/INDEX.md) |
| 运镜/景别/构图/角度/摄影机/斯坦尼康/长镜头/手持/焦段/POV/视点/对话站位/分镜 | shot_design | [shot_design/INDEX.md](shot_design/INDEX.md) |
| 转场/场景转换/音频策略/静默/音乐过渡/二元对立/过场 | scene_transitions | [scene_transitions/INDEX.md](scene_transitions/INDEX.md) |
| 声音/音效/画外音/混音/听觉/环境音/拟音 | sound_design | [sound_design/INDEX.md](sound_design/INDEX.md) |
| 摄影机型号/镜头型号/胶片/画质风格/AI prompt 锚定 | camera_reference | [camera_reference/INDEX.md](camera_reference/INDEX.md) |
| 导演/故事结构/戏剧反讽/张力/场景必要性/巧合/对比强调/反应镜头 | directing | [directing/INDEX.md](directing/INDEX.md) |
| 故事/节拍/类型/logline/中点/B Story/救猫咪/第三幕 | story_design | [story_design/INDEX.md](story_design/INDEX.md) |

## 使用流程

```
1. Agent 遇到具体技法问题
   ↓
2. 在本表中匹配触发信号关键词 → 找到目标子域
   ↓
3. 调用 activate_production_skill 加载子域 INDEX.md 获取详细路由表
   ↓
4. 在 INDEX 中匹配精确触发信号 → 找到目标 SKILL.md
   ↓
5. 调用 activate_production_skill 加载目标 SKILL.md
   ↓
6. 按 R→I→A1→A2→E→B 六段执行
```
