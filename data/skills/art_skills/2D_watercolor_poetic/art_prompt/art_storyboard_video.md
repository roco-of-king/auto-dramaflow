# 水彩视频提示词风格

## 视频美学特征

- **色调**：柔和透明的半透明色彩——鼠尾草绿/暖赭石/淡薰衣草/桉树灰
- **运动**：颜料在湿润纸面自然扩散和晕染——不是机械运动而是有机流动
- **质感**：冷压纸纹理、湿中湿边缘的柔和晕开、干笔的纸面纹理断裂

## Seedance 2.0 prompt 模板

```
Style: Poetic watercolor animation, dreamy atmospheric,
visible cold-pressed paper texture, transparent washes,
wet-on-wet bleeding edges, preserved white paper highlights.
Duration: [总时长]s.

[00-05s] Establishing: [场景]以湿中湿水彩慢慢浮现。
色彩从纸面空白中诞生——[颜色1]和[颜色2]在湿润区域自然交融。
颜料在纸面纤维间扩散，形成柔和的边缘。大量留白。

[05-10s] Subject enters: [角色]以松弛自信的干笔笔触走入画面。
服装用[颜色]透明水洗表现——纸面纹理透过颜料可见。
面部用极简笔触暗示——水彩不宜工笔。
[光线]从[方向]照来——用留白表现光而非加白颜料。

[10-15s] Emotional moment: [关键事件]。
色彩饱和度和对比度在瞬间轻微提升——然后回归柔和的诗意。
一片[花瓣/树叶/雨滴]以慢动作飘落——水彩的边缘在飘落中自然晕开。
画面定格在最诗意的一帧——颜料边缘仍在微微扩散。
冷压纸纹理贯穿整个画面。

Technical: 2D watercolor animation, transparent washes,
visible paper grain, wet-on-wet diffusion,
preserved white highlights (no white paint),
soft organic motion, poetic atmosphere.
```

## 核心约束

1. 所有运动必须是有机的——不能是机械的矢量动画
2. 高光永远用留白——绝不使用白色不透明颜料
3. 纸面纹理必须始终可见——这是水彩的魂
4. 禁止平滑数码渐变/硬边轮廓/3D渲染
