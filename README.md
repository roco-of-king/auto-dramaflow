<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=Auto-Dramaflow&fontSize=90&fontColor=ffffff&animation=fadeIn&fontAlignY=50" width="100%"/>

<p align="center">
  <strong>简体中文</strong> | 
  <a href="./docs/README.en.md">English</a>
</p>

<div align="center">

<img src="./docs/logo.png" alt="Auto-Dramaflow Logo" height="120"/>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=40&duration=3000&pause=1000&color=000000&center=true&vCenter=true&width=600&lines=Auto-Dramaflow;AI%E7%9F%AD%E5%89%A7%E5%B7%A5%E5%8E%82;%E5%8A%A8%E5%8A%A8%E6%89%8B%E6%8C%87%EF%BC%8C%E5%B0%8F%E8%AF%B4%E7%A7%92%E5%8F%98%E5%89%A7%E9%9B%86%EF%BC%81)](https://git.io/typing-svg)

  <p align="center">
    <a href="https://github.com/HBAI-Ltd/Toonflow-app/stargazers">
      <img src="https://img.shields.io/github/stars/HBAI-Ltd/Toonflow-app?style=for-the-badge&logo=github" alt="Stars Badge" />
    </a>
    <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank">
      <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=for-the-badge" alt="Apache-2.0 License Badge" />
    </a>
  </p>
  <p align="center">
    <img src="https://ziadoua.github.io/m3-Markdown-Badges/badges/TypeScript/typescript2.svg" alt="TypeScript" />&nbsp;
    <img src="https://ziadoua.github.io/m3-Markdown-Badges/badges/NodeJS/nodejs2.svg" alt="Node.js" />&nbsp;
    <img src="https://ziadoua.github.io/m3-Markdown-Badges/badges/Docker/docker2.svg" alt="Docker" />&nbsp;
    <img src="https://ziadoua.github.io/m3-Markdown-Badges/badges/Electron/electron2.svg" alt="Electron" />
  </p>

  > 🚀 **一站式短剧工程**：从文本到角色，从分镜到视频，0门槛全流程AI化，创作效率提升10倍+！
  >
  > 本项目基于 [Toonflow](https://github.com/HBAI-Ltd/Toonflow-app) 进行二次开发，新增了**阿里云百炼(DashScope)通义千问模型**、**独立素材上传页面**、**导演技能库(director_skills)**、**导演审阅子Agent**、**分镜图管理接口**等功能。
</div>

---

# 🌟 主要功能

Auto-Dramaflow 是面向短剧生产的 AI 工作台，围绕"策划 → 编剧 → 分镜 → 出片"构建完整闭环，并支持本地化、可编程、可持续迭代的生产流程。

- ✅ **无限画布生产工作台**  
  以类无限画布形式组织剧本、角色、分镜、素材与视频节点，支持自由编排、回溯与并行生产，不受线性步骤限制。
- ✅ **三层 Agent 协作体系**  
  决策层、执行层、监督层协同工作，覆盖任务拆解、内容生成、质量审阅与修订反馈，提升稳定性与成片一致性。
- ✅ **持久化 Agent 记忆**  
  基于本地 ONNX 向量检索的跨会话记忆系统，支持短期消息、长期摘要和语义召回，确保多轮创作连续性。
- ✅ **可编程供应商系统**  
  支持在设置中心直接编写供应商 TypeScript 逻辑并即时生效，无需改源码或重启，便于私有化和多模型接入。
- ✅ **章节事件图谱驱动改编**  
  自动提取原著章节事件并结构化存储，剧本改编按事件图谱精准调用上下文，减少长文本信息丢失。
- ✅ **Skill 文件化配置**  
  ScriptAgent 与 ProductionAgent 的核心提示词外化为 Markdown Skill 文件，支持在线编辑与快速调优。

### 🆕 本仓库新增功能

- ✅ **阿里云百炼(DashScope)通义千问模型支持**  
  新增 DashScope 供应商，完整支持 Qwen3/Qwen2.5 系列文本模型、Wan2.6 图片生成、Wan2.7 及 HappyHorse 视频生成。
- ✅ **独立素材上传页面 (upload.html)**  
  提供独立的 Web 素材上传界面，支持新建素材/关联已有素材两种模式，方便快速批量导入角色、场景、道具图片。
- ✅ **导演技能库 (director_skills)**  
  新增 31 位知名导演风格配置（如克里斯托弗·诺兰、周星驰、宫崎骏等），导演 Agent 可参考对应风格进行分镜规划和影片节奏控制。
- ✅ **导演审阅子 Agent**  
  ScriptAgent 新增导演审阅子 Agent，可基于导演风格对剧本和分镜进行风格化审阅与调整建议。
- ✅ **分镜图管理接口**  
  新增分镜图上传 (`storyboard/uploadImage`)、重置 (`storyboard/resetImage`) 及视频提示词检查 (`workbench/checkVideoPrompt`) 接口，完善分镜工作流。
- ✅ **Agent 模型配置动态更新**  
  新增 `setting/agentDeploy/updateAgentModel` 接口，支持在线动态切换各 Agent 子模块所使用的 AI 模型，无需重启服务。

---

# 📦 应用场景

- 短视频内容创作
- 小说影视化实验
- AI 文学改编工具
- 剧本开发与快速原型
- 视频素材生成

---

# 🆕 本仓库新增内容详解

## 阿里云百炼(DashScope)通义千问模型

在原有 Toonflow 支持的模型供应商（OpenAI / Anthropic / Google / DeepSeek / 智谱 / MiniMax / xAI 等）基础上，新增了完整的**阿里云百炼 DashScope** 供应商支持。

### 支持的模型

| 类型 | 模型名称 | 说明 |
| :--- | :--- | :--- |
| 🔤 文本 | Qwen3-235B-A22B | 旗舰推理模型，支持思考模式 |
| 🔤 文本 | Qwen3-32B / 14B / 8B | 新一代 Qwen3 系列，支持思考模式 |
| 🔤 文本 | Qwen2.5-72B / 32B / 14B / 7B | Qwen2.5 指令微调系列 |
| 🖼️ 图片 | Wan2.6-T2I | 文生图模型 |
| 🎬 视频 | Wan2.7-T2V | 文生视频（2-15秒，720P/1080P） |
| 🎬 视频 | Wan2.7-I2V | 图生视频-首帧模式（2-10秒） |
| 🎬 视频 | HappyHorse-1.0-T2V | 文生视频（3-15秒） |
| 🎬 视频 | HappyHorse-1.0-I2V | 图生视频（3-15秒） |
| 🎬 视频 | HappyHorse-1.0-R2V | 参考图生视频（最多9张参考图） |

### 配置方式

1. 前往 [阿里云百炼控制台](https://bailian.console.aliyun.com/) 获取 API Key
2. 在 Toonflow 设置中心 → 模型供应商 → 添加供应商 → 选择"阿里云百炼(DashScope)"
3. 填入 API Key 和请求地址（默认 `https://dashscope.aliyuncs.com/api/v1`）
4. 保存后即可在剧本生成、图片生成、视频生成中选择通义千问系列模型

### 技术实现

DashScope 供应商文件位于 `data/vendor/dashscope.ts`，实现了完整的：
- **文本生成**：通过 OpenAI 兼容模式接入，支持 reasoning_effort 思考级别控制
- **图片生成**：同步 + 异步轮询双模式，支持多比例多尺寸输出
- **视频生成**：异步任务提交 + 智能轮询，支持首帧/尾帧/多参考图输入
- **自动更新**：供应商版本检查与热更新机制

---

## 独立素材上传页面 (upload.html)

为了方便快速批量导入素材图片，新增了独立的 Web 上传页面 `data/web/upload.html`。

### 功能特性

- 🔐 **独立登录**：使用 Toonflow 账号登录，Token 自动持久化到 localStorage
- 📁 **项目关联**：自动拉取用户所有项目列表，选择目标项目上传
- 🔄 **双模式上传**：
  - **新建素材并上传**：同时创建素材记录（名称/描述/提示词）并上传图片
  - **关联已有素材**：选择已创建的素材，直接追加新图片
- 🎭 **多类型支持**：角色(role)、场景(scene)、道具(tool) 三种素材类型
- 🖼️ **图片预览**：上传前实时预览，不满意可重新选择
- 📡 **API 对接**：通过 `/api/assets/uploadAssetImage` 接口完成上传，自动生成缩略图

### 访问方式

启动服务后，在浏览器中访问：

```
http://localhost:10588/upload.html
```

### 使用流程

1. 打开 `upload.html`，输入账号密码登录
2. 选择目标项目
3. 选择模式（新建素材 / 关联已有素材）
4. 选择素材类型（角色 / 场景 / 道具）
5. 填写素材信息（新建模式）或选择已有素材（关联模式）
6. 点击上传区域选择图片，预览确认
7. 点击"提交上传"完成

### API 接口

```
POST /api/assets/uploadAssetImage
```

| 参数 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| projectId | number | ✅ | 项目 ID |
| type | enum | ✅ | 素材类型：role / scene / tool |
| imageBase64 | string | ✅ | 图片 Base64 数据 |
| name | string | 新建必填 | 素材名称 |
| describe | string | 新建必填 | 视觉描述 |
| prompt | string | 选填 | 英文提示词 |
| assetId | number | 关联必填 | 已有素材 ID |

---

## 导演技能库 (director_skills)

为导演 Agent 提供了 31 位知名导演的风格参考文件，位于 `data/skills/director_skills/` 目录。每位导演的风格文件涵盖其标志性的镜头语言、叙事节奏、色调偏好、场景构图等视觉美学特征。

| 类别 | 导演 |
| :--- | :--- |
| 🎬 好莱坞 | 克里斯托弗·诺兰、史蒂文·斯皮尔伯格、昆汀·塔伦蒂诺、詹姆斯·卡梅隆、大卫·芬奇、弗朗西斯·福特·科波拉 |
| 🎬 欧洲 | 英格玛·伯格曼、米开朗基罗·安东尼奥尼、费德里科·费里尼、路易斯·布努埃尔 |
| 🎬 亚洲 | 黑泽明、宫崎骏、小津安二郎、奉俊昊、朴赞郁、是枝裕和 |
| 🎬 华语 | 周星驰、王家卫、张艺谋、陈凯歌、姜文、侯孝贤、杨德昌、徐克、吴宇森、贾樟柯、李安、杜琪峰、陈可辛、路阳 |

### 使用方式

1. 在项目设置中选择目标导演风格
2. 导演规划 Agent 会自动加载对应导演的 Markdown 风格文件作为参考
3. 生成的分镜 prompt 和视频 prompt 会融入该导演的视觉美学特征

### 文件结构

```
data/skills/director_skills/
├── 克里斯托弗·诺兰.md
├── 周星驰.md
├── 宫崎骏.md
└── ...
```

---

## 导演审阅子 Agent

在 ScriptAgent 三层架构（决策层 → 执行层 → 监督层）中新增导演审阅子 Agent，位于监督层。

- **功能**：基于选定的导演风格，对剧本和分镜进行风格化审阅
- **输出**：针对分镜节奏、镜头语言、画面构图、色调氛围等维度提供调整建议
- **配置**：通过 `updateAgentModel` 接口可动态切换审阅 Agent 使用的 AI 模型

---

## 分镜图管理接口

新增三个 API 接口，完善分镜工作流：

### 分镜图上传

```
POST /api/production/storyboard/uploadImage
```

支持将本地生成的图片直接上传并关联到指定分镜，跳过 AI 生成环节。

### 分镜图重置

```
POST /api/production/storyboard/resetImage
```

重置某个分镜的图片状态，支持重新生成或重新上传。

### 视频提示词检查

```
POST /api/production/workbench/checkVideoPrompt
```

在提交视频生成任务前，对分镜的提示词进行格式校验和内容检查，减少无效调用。

### Agent 模型动态更新

```
POST /api/setting/agentDeploy/updateAgentModel
```

支持在线动态切换各 Agent 子模块（决策层/执行层/监督层/导演审阅等）所使用的 AI 模型，无需修改配置文件和重启服务。

---

# 🚀 安装

## 前置条件

在安装和使用本软件之前，请准备以下内容：

- ✅ 大语言模型 AI 服务接口地址（支持 OpenAI / Anthropic / DeepSeek / 通义千问等多种兼容 API）
- ✅ 视频生成服务接口地址（支持豆包视频 / Seedance / Wan2.7 / HappyHorse 等）
- ✅ 图片生成模型服务接口（支持 Nano Banana Pro / GPT Image / Wan2.6 等）

## 本机安装

### 1. 下载与安装

| 操作系统 | 说明           |
| :------: | :------------- |
| Windows  | 官方发布安装包 |
|  Linux   | 官方发布安装包 |
|  macOS   | 官方发布安装包 |

> [!CAUTION]
> MacOS 系统请到 设置-隐私与安全性 配置安全性否则可能因证书问题无法正常打开

### 2. 启动服务

安装完成后，启动程序即可开始使用本服务。

> ⚠️ **首次登录**  
> 账号：`admin`  
> 密码：`admin123`

## Docker 部署

### 前置条件

- 已安装 [Docker](https://docs.docker.com/get-docker/)（版本 20.10+）

### 本地构建

```shell
# 克隆项目
git clone https://github.com/<your-username>/auto-dramaflow.git
cd auto-dramaflow

# 使用 docker-compose 本地构建并启动
yarn docker:local

# 或者手动构建
docker build -t auto-dramaflow .
docker run -d -p <本地端口>:10588 -v <本地数据路径>:/app/data auto-dramaflow

# 此时在相应端口的 /web/index.html 路径即可访问页面
# 例如 http://localhost:10588/web/index.html
```

### 服务端口说明

| 端口    | 用途     | 部署映射      |
| ------- | -------- | ------------- |
| `10588` | 软件界面 | `10588:10588` |

**环境变量说明：**

| 变量       | 说明                               |
| ---------- | ---------------------------------- |
| `NODE_ENV` | 运行环境，`prod` 表示生产环境      |
| `PORT`     | 服务监听端口（默认 10588）         |
| `OSSURL`   | 文件存储访问地址，用于静态资源访问 |

---

## 云端部署

### 一、服务器环境要求

- **系统**：Ubuntu 20.04+ / CentOS 7+
- **Node.js**：23.x（推荐，最低 23.11.1+）
- **内存**：2GB+

### 二、服务器部署

#### 1. 安装环境

```bash
# 安装 Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 23
# 安装 Yarn 和 PM2
npm install -g yarn pm2
```

#### 2. 部署项目

```bash
cd /opt
git clone https://github.com/<your-username>/auto-dramaflow.git
cd auto-dramaflow
yarn install
yarn build
```

#### 3. 配置 PM2

创建 `pm2.json` 文件：

```json
{
  "name": "auto-dramaflow",
  "script": "data/serve/app.js",
  "instances": "max",
  "exec_mode": "cluster",
  "env": {
    "NODE_ENV": "prod",
    "PORT": 10588,
    "OSSURL": "http://127.0.0.1:10588/"
  }
}
```

#### 4. 启动服务

```bash
pm2 start pm2.json
pm2 startup
pm2 save
```

#### 5. 常用命令

```bash
pm2 list                 # 查看进程
pm2 logs auto-dramaflow  # 查看日志
pm2 restart all          # 重启服务
pm2 monit                # 监控面板
```

> ⚠️ **首次登录**  
> 账号：`admin`  
> 密码：`admin123`

---

# 🔧 开发流程指南

## 🛠️ 技术栈

| 类别       | 技术                                                                                      |
| ---------- | ----------------------------------------------------------------------------------------- |
| 运行时     | Node.js 23.11.1+                                                                          |
| 语言       | TypeScript 5.x                                                                            |
| 后端框架   | Express 5                                                                                 |
| 数据库     | SQLite（better-sqlite3 / knex）                                                           |
| AI 集成    | Vercel AI SDK（OpenAI / Anthropic / Google / DeepSeek / 智谱 / MiniMax / 通义千问 / xAI） |
| 本地推理   | @huggingface/transformers（ONNX）                                                         |
| 实时通信   | Socket.IO                                                                                 |
| 桌面客户端 | Electron 40                                                                               |
| 图像处理   | Sharp                                                                                     |
| 容器化     | Docker                                                                                    |

## 开发环境准备

- **Node.js**：版本要求 23.11.1 及以上
- **Yarn**：推荐作为项目包管理器

## 快速启动项目

1. **克隆项目**

   ```bash
   git clone https://github.com/<your-username>/auto-dramaflow.git
   cd auto-dramaflow
   ```

2. **安装依赖**

   ```bash
   yarn install
   ```

3. **启动开发环境**

   - **仅启动后端服务**

     ```bash
     yarn dev
     ```

     > ⚠️ 此命令仅启动后端 API 服务（端口 10588），不包含前端页面。

   - **启动 Electron 桌面客户端**

     ```bash
     yarn dev:gui
     ```

     > 此命令会同时启动后端服务和 Electron 桌面窗口，内置前端页面，开箱即用。

   - **生产模式启动**

     ```bash
     yarn start
     ```

4. **项目打包**

   ```bash
   yarn build          # 编译 TypeScript
   yarn dist:win       # 打包 Windows 可执行程序
   yarn dist:mac       # 打包 Mac 可执行程序
   yarn dist:linux     # 打包 Linux 可执行程序
   ```

5. **代码质量检查**

   ```bash
   yarn lint
   ```

---

# 🏗️ 项目结构

```
📂 build/                    # 编译产物
📂 data/                     # 运行时数据
│  ├─ 📂 models/            # 本地推理模型（ONNX）
│  ├─ 📂 oss/               # 对象存储（素材/角色/场景）
│  ├─ 📂 serve/             # 生产环境入口
│  ├─ 📂 skills/            # Agent 技能提示词
│  │   ├─ director_skills/  # 🆕 导演技能库（31位导演风格）
│  │   └─ ...
│  ├─ 📂 vendor/            # AI 供应商脚本
│  │   ├─ dashscope.ts      # 🆕 阿里云百炼(DashScope)供应商
│  │   ├─ openai.ts         # OpenAI 供应商
│  │   ├─ deepseek.ts       # DeepSeek 供应商
│  │   ├─ volcengine.ts     # 火山引擎(豆包)供应商
│  │   └─ ...               # 其他供应商
│  └─ 📂 web/               # 前端编译产物（内置）
│      └─ upload.html       # 🆕 独立素材上传页面
📂 docs/                     # 文档资源
📂 env/                      # 环境配置
📂 scripts/                  # 构建与辅助脚本
📂 src/
├─ 📂 agents/               # AI Agent 模块
│  ├─ 📂 productionAgent/   # 生产 Agent
│  └─ 📂 scriptAgent/       # 剧本 Agent
├─ 📂 lib/                  # 公共库
├─ 📂 middleware/            # 中间件
├─ 📂 routes/               # 路由模块
│  ├─ 📂 assets/            # 素材管理（含 uploadAssetImage）
│  ├─ 📂 artStyle/          # 画风管理
│  ├─ 📂 assetsGenerate/    # 素材生成
│  ├─ 📂 cornerScape/       # 分镜管理
│  ├─ 📂 novel/             # 小说管理
│  ├─ 📂 production/        # 制作管理
│  │   ├─ storyboard/
│  │   │   ├─ uploadImage.ts  # 🆕 分镜图上传
│  │   │   └─ resetImage.ts   # 🆕 分镜图重置
│  │   └─ workbench/
│  │       └─ checkVideoPrompt.ts  # 🆕 视频提示词检查
│  ├─ 📂 project/           # 项目管理
│  ├─ 📂 script/            # 剧本生成
│  ├─ 📂 scriptAgent/       # 剧本 Agent 接口
│  ├─ 📂 setting/           # 系统设置
│  │   └─ agentDeploy/
│  │       └─ updateAgentModel.ts  # 🆕 Agent模型动态更新
│  └─ 📂 task/              # 任务管理
├─ 📂 socket/               # WebSocket 实时通信
├─ 📂 types/                # TypeScript 类型声明
├─ 📂 utils/                # 工具函数
├─ 📄 app.ts                # 应用入口
├─ 📄 core.ts               # 核心初始化
├─ 📄 router.ts             # 路由注册
└─ 📄 utils.ts              # 通用工具
📄 Dockerfile                # Docker 构建文件
📄 electron-builder.yml      # Electron 打包配置
📄 package.json              # 项目配置
📄 tsconfig.json             # TypeScript 配置
📄 LICENSE                   # 许可证（Apache-2.0）
```

---

# 🙏 致谢与上游

本项目基于 [Toonflow](https://github.com/HBAI-Ltd/Toonflow-app) 进行二次开发，感谢原作者的杰出工作。

### 上游仓库

| 仓库 | 说明 | 地址 |
| :--- | :--- | :--- |
| **Toonflow-app** | 上游原项目 | [GitHub](https://github.com/HBAI-Ltd/Toonflow-app) |
| **Toonflow-web** | 前端源代码 | [GitHub](https://github.com/HBAI-Ltd/Toonflow-web) |

### 开源致谢

感谢以下开源项目为 Auto-Dramaflow 提供强大支持：

- [Express](https://expressjs.com/) - 快速、开放、极简的 Node.js Web 框架
- [AI SDK](https://ai-sdk.dev/) - 面向 TypeScript 的 AI 工具包
- [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3) - 高性能 SQLite3 绑定库
- [Sharp](https://sharp.pixelplumbing.com/) - 高性能 Node.js 图像处理库
- [Axios](https://axios-http.com/) - 基于 Promise 的 HTTP 客户端
- [Zod](https://zod.dev/) - TypeScript 优先的模式验证库
- [Socket.IO](https://socket.io/) - 实时双向事件通信引擎
- [Electron](https://www.electronjs.org/) - 跨平台桌面应用开发框架
- [Hugging Face Transformers](https://huggingface.co/docs/transformers.js) - 本地 ML 推理库
- [阿里云百炼(DashScope)](https://bailian.console.aliyun.com/) - 通义千问大模型平台

---

# 📜 许可证

本项目基于 [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) 协议开源发布。

完整协议详见 [LICENSE](./LICENSE) 文件。

> ⚠️ 上游 Toonflow 项目有其独立的商业授权补充协议，如涉及商业分发请参考[上游仓库](https://github.com/HBAI-Ltd/Toonflow-app)的完整许可条款。

##### copyright © 基于 Toonflow 二次开发

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>
