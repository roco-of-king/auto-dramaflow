# 水墨视频提示词风格

## 视频美学特征

- **色调**：墨黑色谱 + 暖米纸色 + 极淡的青蓝/赭石点缀
- **运动**：笔触可见的"活"的画面——墨色在纸上晕染扩散、笔触缓慢推进
- **质感**：宣纸纤维纹理、墨色不均匀的自然晕染、飞白笔触

## Seedance 2.0 prompt 模板

```
Style: Traditional Chinese ink-wash animation (水墨动画),
render on aged xuan rice paper, visible fiber texture,
ink bleeding and spreading naturally.
Duration: [总时长]s.

[00-05s] Establishing: 浓墨层叠的山峦从雾气中浮现，
淡墨渲染的远山几乎溶解于留白的天空。
一道瀑布以飞白笔法从画面中景落下——水的运动是墨色在纸上的自然晕染。
云雾以留白表现——纸面空白处即是云海，缓缓流动。
暖米色纸底，纤维纹理可见。

[05-10s] Subject enters: 一个[人物]从画面[方向]以工笔细线勾勒的身影走入场景。
人物衣纹以大笔写意扫出——墨色飞白随动作拉伸。面部保持工笔精细。
[动作描述]。

[10-15s] Climax: [关键事件]。墨色从浓到淡的过渡是自然的。
画面边缘有毛边——陈年宣纸的边缘质感。
右上方草书题字逐笔写下：[题字内容]。
左下方朱文印章落下。切至纸面。

Technical: 2D hand-drawn animation, ink-wash painting style,
visible brush strokes, wet-on-dry ink bleeding,
aged xuan paper texture, warm beige base,
minimalist color palette of ink black + warm paper + vermillion seal.
```

## 核心约束

1. 运动必须表现笔触——不能是平滑的矢量动画
2. 色彩只允许：墨黑 + 暖米纸色 + 朱砂红 + 极淡设色
3. 必须有可见的纸面纹理
4. 禁止3D渲染/物理精确光照/真实水面反射
