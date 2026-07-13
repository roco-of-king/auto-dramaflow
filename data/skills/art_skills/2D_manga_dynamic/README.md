# 2D 动态少年漫风格

动态少年漫风格 (Dynamic Shōnen Manga Style) 是一套完整的动漫视觉资产生产管线，专为 MAPPA/Studio Pierrot 级数字 2D 动画打造。覆盖角色设计、道具、场景、分镜视频提示词和导演技能体系，支持彩色动画与黑白漫画双模式输出。

## 目录结构

```
2D_manga_dynamic/
├── README.md                              # 风格概述
├── prefix.md                              # 风格前缀与核心视觉定义
├── art_prompt/                            # 美术资产提示词
│   ├── art_character.md                   # 角色设计（战斗关键帧/角色阵容表/表情网格）
│   ├── art_character_derivative.md        # 角色衍生变体
│   ├── art_prop.md                        # 道具设计
│   ├── art_prop_derivative.md             # 道具衍生变体
│   ├── art_scene.md                       # 场景设计
│   ├── art_scene_derivative.md            # 场景衍生变体
│   └── art_storyboard_video.md            # Seedance 2.0 视频分镜
├── driector_skills/                       # 导演技能体系
│   ├── director_planning_style.md         # 导演规划风格
│   ├── director_storyboard.md             # 分镜指导
│   └── director_storyboard_table_style.md # 分镜表风格
└── images/                                # 封面与参考图
    └── cover
```

## 核心视觉语言

- **彩色模式**：深海军蓝 + 电光青 + 绯红，强烈赛璐珞阴影，锐利线稿，戏剧性边缘光
- **漫画模式**：黑色墨水 + 网点纸渐变 + 泛黄纸纹，黑白单色
- **动态语言**：速度线、冲击帧、动能构图、透视夸张

## 使用方式

1. 在美术资产生成时引用对应的 `art_prompt/` 文件
2. 在导演 Agent 编排时引用 `driector_skills/` 文件
3. 将 `prefix.md` 作为所有提示词的前缀注入
