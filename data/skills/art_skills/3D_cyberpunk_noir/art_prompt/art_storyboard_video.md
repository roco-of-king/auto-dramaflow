# 赛博朋克视频提示词风格

## 视频美学特征

- **色调**：青蓝/墨绿主导，洋红/暖橙点缀，低饱和高对比
- **光影**：体积光（Volumetric Lighting）、霓虹反射、湿润表面高光、丁达尔光束
- **质感**：胶片颗粒、变形宽银幕镜头光斑、轻微色差
- **运镜**：缓慢推轨建立压迫感→快切表现动作→无人机航拍展示城市全貌

## Seedance 2.0 prompt 模板

```
Style: Cyberpunk Noir, Blade Runner 2049 cinematography.
Duration: [总时长]s.

[00-05s] Wide establishing: 雨夜[城市名]，霓虹灯光在湿沥青上形成长长的彩色倒影。
低角度仰拍，巨型建筑群在雾中若隐若现。
一架飞行器拖曳着蓝色推进器尾焰划过画面。压迫性漫射光。

[05-10s] Medium tracking: 镜头跟随[角色]穿过高架夜市。
[角色]的面庞被经过的霓虹招牌依次照亮——洋红、青蓝、酸性绿。
蒸汽从地下管道喷出，[角色]的轮廓被背光勾勒。

[10-15s] Close-up climax: [角色]停下，抬头看向[关键元素]。
眼球反射出全息屏幕的微光。慢动作——一滴雨水从[角色]的睫毛滑落。
背景霓虹散景旋转。切黑。

Technical: 35mm anamorphic, film grain 10%, shallow depth of field,
desaturated teal palette with magenta accent lights,
volumetric fog, rain-slicked surfaces.
```

## 核心约束

1. 禁止白天场景——赛博朋克的灵魂在夜晚
2. 每镜头必须有至少 1 个可见光源
3. 必须有湿润/反光/蒸汽/雾 中的至少 1 种大气介质
4. 色彩控制在青蓝/墨绿/洋红范围内，不超过 10% 的暖色
