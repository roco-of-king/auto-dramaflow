---
name: weather_control
description: 天气视觉控制系统——8种天气类型的色调/对比度/阴影/反光/能见度/湿润度参数表
type: production_skill
---
# 天气视觉控制系统

## 八种天气参数速查

| 天气 | 色调 | 对比度 | 阴影 | 反光 | 能见度 | 表面湿润度 |
|------|------|--------|------|------|--------|------------|
| 晴天 | 暖 | 高 | 清晰硬阴影 | 干燥/无 | 高 | 干燥 |
| 阴天 | 冷 | 低 | 柔和无方向 | 无 | 中高 | 干燥 |
| 雨天 | 灰冷 | 中 | 柔和无方向 | 高（湿润表面反光） | 中 | 湿/积水 |
| 雪天 | 冷白 | 中低 | 柔和高亮 | 中（雪地漫反射） | 中低 | 白色覆盖 |
| 雾天 | 冷灰 | 极低 | 无 | 无 | 低 | 微湿 |
| 黄昏 | 暖金 | 中 | 长阴影 | 低 | 中高 | 干燥 |
| 夜晚 | 冷蓝 | 高 | 人工光源方向 | 高（路面/水面） | 低 | 因场景而异 |
| 风暴 | 灰暗 | 极高 | 戏剧性方向光 | 高 | 低 | 湿/积水 |

## 各天气 prompt 模板

### 晴天
```
bright sunlight, clear sky, sharp defined shadows,
warm color temperature 5500K, high visibility,
dry surfaces, crisp details
```

### 阴天
```
overcast sky, soft diffused lighting, no harsh shadows,
cool muted colors, flat even illumination,
dry surfaces, low contrast atmosphere
```

### 雨天
```
rain falling, wet reflective surfaces, puddles on ground,
gray overcast sky, raindrops on surfaces,
cool color temperature, rippling water reflections,
glistening wet streets
```

### 雪天
```
snow covered landscape, white blanket, soft diffused light,
cold blue-white tones, snowflakes falling,
bright snow reflections, muted colors beneath snow
```

### 雾天
```
dense fog, low visibility, soft blurred outlines,
cold gray atmosphere, muted distant objects,
atmospheric perspective, mysterious mood,
objects fading into mist
```

### 黄昏
```
golden hour, warm orange light, long dramatic shadows,
sunset sky gradient, golden rim light on subjects,
low angle sunlight, 3500K warm color temperature
```

### 夜晚
```
night scene, artificial light sources, cool blue ambient,
high contrast pools of light, neon reflections on wet surfaces,
deep shadows, street lamps, window lights,
moonlight if outdoor natural scene
```

### 风暴
```
storm clouds, dramatic sky, lightning flashes,
strong wind effects, rain lashing, dark atmosphere,
high contrast, occasional bright flashes,
turbulent mood, swaying elements
```

## 使用方式

在生成视频 prompt 或场景 prompt 时，根据需要将对应天气模板追加到末尾：

```
[主体描述] + [场景描述] + [天气模板] + [画质约束]
```
