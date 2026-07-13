/**
 * Auto-Dramaflow AI供应商 - 阿里云百炼(DashScope)
 * @version 1.0
 *
 * 支持模型：
 *   - 文本：Qwen3 / Qwen2.5 系列
 *   - 视频(文生)：Wan2.7-T2V / HappyHorse-1.0-T2V
 *   - 视频(图生)：Wan2.7-I2V / HappyHorse-1.0-I2V
 *   - 视频(参考生)：HappyHorse-1.0-R2V
 */

// ============================================================
// 类型定义
// ============================================================

type VideoMode =
  | "singleImage"
  | "startEndRequired"
  | "endFrameOptional"
  | "startFrameOptional"
  | "text"
  | (`videoReference:${number}` | `imageReference:${number}` | `audioReference:${number}`)[];

interface TextModel {
  name: string;
  modelName: string;
  type: "text";
  think: boolean;
}

interface ImageModel {
  name: string;
  modelName: string;
  type: "image";
  mode: ("text" | "singleImage" | "multiReference")[];
  associationSkills?: string;
}

interface VideoModel {
  name: string;
  modelName: string;
  type: "video";
  mode: VideoMode[];
  associationSkills?: string;
  audio: "optional" | false | true;
  durationResolutionMap: { duration: number[]; resolution: string[] }[];
}

interface TTSModel {
  name: string;
  modelName: string;
  type: "tts";
  voices: { title: string; voice: string }[];
}

interface VendorConfig {
  id: string;
  version: string;
  name: string;
  author: string;
  description?: string;
  icon?: string;
  inputs: { key: string; label: string; type: "text" | "password" | "url"; required: boolean; placeholder?: string }[];
  inputValues: Record<string, string>;
  models: (TextModel | ImageModel | VideoModel | TTSModel)[];
}

type ReferenceList =
  | { type: "image"; sourceType: "base64"; base64: string }
  | { type: "audio"; sourceType: "base64"; base64: string }
  | { type: "video"; sourceType: "base64"; base64: string };

interface ImageConfig {
  prompt: string;
  referenceList?: Extract<ReferenceList, { type: "image" }>[];
  size: "1K" | "2K" | "4K";
  aspectRatio: `${number}:${number}`;
}

interface VideoConfig {
  duration: number;
  resolution: string;
  aspectRatio: "16:9" | "9:16";
  prompt: string;
  referenceList?: ReferenceList[];
  audio?: boolean;
  mode: VideoMode[];
}

interface TTSConfig {
  text: string;
  voice: string;
  speechRate: number;
  pitchRate: number;
  volume: number;
  referenceList?: Extract<ReferenceList, { type: "audio" }>[];
}

interface PollResult {
  completed: boolean;
  data?: string;
  error?: string;
}

// ============================================================
// 全局声明
// ============================================================

declare const axios: any;
declare const logger: (msg: string) => void;
declare const jsonwebtoken: any;
declare const zipImage: (base64: string, size: number) => Promise<string>;
declare const zipImageResolution: (base64: string, w: number, h: number) => Promise<string>;
declare const mergeImages: (base64Arr: string[], maxSize?: string) => Promise<string>;
declare const urlToBase64: (url: string) => Promise<string>;
declare const pollTask: (fn: () => Promise<PollResult>, interval?: number, timeout?: number) => Promise<PollResult>;
declare const createOpenAI: any;
declare const createDeepSeek: any;
declare const createZhipu: any;
declare const createQwen: any;
declare const createAnthropic: any;
declare const createOpenAICompatible: any;
declare const createXai: any;
declare const createMinimax: any;
declare const createGoogleGenerativeAI: any;
declare const exports: {
  vendor: VendorConfig;
  textRequest: (m: TextModel, t: boolean, tl: 0 | 1 | 2 | 3) => any;
  imageRequest: (c: ImageConfig, m: ImageModel) => Promise<string>;
  videoRequest: (c: VideoConfig, m: VideoModel) => Promise<string>;
  ttsRequest: (c: TTSConfig, m: TTSModel) => Promise<string>;
  checkForUpdates?: () => Promise<{ hasUpdate: boolean; latestVersion: string; notice: string }>;
  updateVendor?: () => Promise<string>;
};

// ============================================================
// 供应商配置
// ============================================================

const vendor: VendorConfig = {
  id: "dashscope",
  version: "2.0",
  author: "Toonflow",
  name: "阿里云百炼(DashScope)",
  description: "阿里云百炼大模型平台，支持Qwen文本模型、Wan2.7视频生成、HappyHorse视频生成。\n\n需要在[百炼控制台](https://bailian.console.aliyun.com/)获取API Key。",
  inputs: [
    { key: "apiKey", label: "API Key", type: "password", required: true, placeholder: "sk-xxxxxxxxxxxxxxxx" },
    { key: "baseUrl", label: "请求地址", type: "url", required: true, placeholder: "https://dashscope.aliyuncs.com/api/v1" },
  ],
  inputValues: {
    apiKey: "",
    baseUrl: "https://dashscope.aliyuncs.com/api/v1",
  },
  models: [
    // ===================== 文本模型 =====================
    { name: "Qwen3-235B-A22B", modelName: "qwen3-235b-a22b", type: "text", think: true },
    { name: "Qwen3-32B", modelName: "qwen3-32b", type: "text", think: true },
    { name: "Qwen3-14B", modelName: "qwen3-14b", type: "text", think: true },
    { name: "Qwen3-8B", modelName: "qwen3-8b", type: "text", think: true },
    { name: "Qwen2.5-72B", modelName: "qwen2.5-72b-instruct", type: "text", think: false },
    { name: "Qwen2.5-32B", modelName: "qwen2.5-32b-instruct", type: "text", think: false },
    { name: "Qwen2.5-14B", modelName: "qwen2.5-14b-instruct", type: "text", think: false },
    { name: "Qwen2.5-7B", modelName: "qwen2.5-7b-instruct", type: "text", think: false },
    // ===================== Wan2.6 图片模型 =====================
    {
      name: "Wan2.6-T2I(文生图)",
      modelName: "wan2.6-t2i",
      type: "image",
      mode: ["text"],
    },
    // ===================== Wan2.7 视频模型 =====================
    {
      name: "Wan2.7-T2V(文生视频)",
      modelName: "wan2.7-t2v",
      type: "video",
      mode: ["text"],
      audio: false,
      durationResolutionMap: [{ duration: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], resolution: ["720P", "1080P"] }],
    },
    {
      name: "Wan2.7-I2V(图生视频-首帧)",
      modelName: "wan2.7-i2v",
      type: "video",
      mode: ["startFrameOptional"],
      audio: false,
      durationResolutionMap: [{ duration: [2, 3, 4, 5, 6, 7, 8, 9, 10], resolution: ["720P", "1080P"] }],
    },
    // ===================== HappyHorse 视频模型 =====================
    {
      name: "HappyHorse-T2V(文生视频)",
      modelName: "happyhorse-1.0-t2v",
      type: "video",
      mode: ["text"],
      audio: false,
      durationResolutionMap: [{ duration: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], resolution: ["720P", "1080P"] }],
    },
    {
      name: "HappyHorse-I2V(图生视频)",
      modelName: "happyhorse-1.0-i2v",
      type: "video",
      mode: ["startFrameOptional"],
      audio: false,
      durationResolutionMap: [{ duration: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], resolution: ["720P", "1080P"] }],
    },
    {
      name: "HappyHorse-R2V(参考生视频)",
      modelName: "happyhorse-1.0-r2v",
      type: "video",
      mode: [["imageReference:9"]],
      audio: false,
      durationResolutionMap: [{ duration: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], resolution: ["720P", "1080P"] }],
    },
  ],
};

// ============================================================
// 辅助工具
// ============================================================

const getHeaders = (asyncMode: boolean = false) => {
  if (!vendor.inputValues.apiKey) throw new Error("缺少API Key");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${vendor.inputValues.apiKey.replace(/^Bearer\s+/i, "")}`,
  };
  if (asyncMode) {
    headers["X-DashScope-Async"] = "enable";
  }
  return headers;
};

const getBaseUrl = () => vendor.inputValues.baseUrl.replace(/\/+$/, "");

// ============================================================
// 适配器函数
// ============================================================

const textRequest = (model: TextModel, think: boolean, thinkLevel: 0 | 1 | 2 | 3) => {
  if (!vendor.inputValues.apiKey) throw new Error("缺少API Key");
  const apiKey = vendor.inputValues.apiKey.replace(/^Bearer\s+/i, "");

  // 阿里云百炼兼容 OpenAI 格式的端点
  const baseUrl = vendor.inputValues.baseUrl.replace(/\/+$/, "");
  const compatibleUrl = baseUrl.replace(/\/api\/v1$/, "") + "/compatible-mode/v1";

  const effortMap: Record<number, string> = {
    0: "minimal",
    1: "low",
    2: "medium",
    3: "high",
  };

  return createOpenAICompatible({
    name: "dashscope",
    baseURL: compatibleUrl,
    apiKey,
    fetch: async (url: string, options?: RequestInit) => {
      const rawBody = JSON.parse((options?.body as string) ?? "{}");
      const modifiedBody: any = {
        ...rawBody,
      };
      if (think) {
        modifiedBody.reasoning_effort = effortMap[thinkLevel];
      }
      return await fetch(url, {
        ...options,
        body: JSON.stringify(modifiedBody),
      });
    },
  }).chatModel(model.modelName);
};

const imageRequest = async (config: ImageConfig, model: ImageModel): Promise<string> => {
  const baseUrl = getBaseUrl();
  const headers = getHeaders(false);

  // 根据比例和尺寸等级计算像素尺寸
  const [w, h] = config.aspectRatio.split(":").map(Number);
  const sizeTable: Record<string, Record<string, string>> = {
    "1K": { "1:1": "1024*1024", "16:9": "1280*720", "9:16": "720*1280", "4:3": "1152*864", "3:4": "864*1152", "3:2": "1248*832", "2:3": "832*1248" },
    "2K": { "1:1": "1280*1280", "16:9": "1696*960", "9:16": "960*1696", "4:3": "1536*1152", "3:4": "1152*1536", "3:2": "1664*1104", "2:3": "1104*1664" },
    "4K": { "1:1": "2048*2048", "16:9": "2880*1620", "9:16": "1620*2880", "4:3": "2304*1728", "3:4": "1728*2304", "3:2": "2496*1664", "2:3": "1664*2496" },
  };

  const sizeKey = config.size || "2K";
  const ratioKey = config.aspectRatio;
  const table = sizeTable[sizeKey];
  const size = (table && table[ratioKey]) ? table[ratioKey] : "1280*1280";

  // 构造消息内容
  const content: any[] = [{ text: config.prompt || "" }];

  // 参考图片（过滤掉空值）
  if (config.referenceList && config.referenceList.length > 0) {
    for (const ref of config.referenceList) {
      if (ref.base64) {
        content.push({ image: ref.base64 });
      }
    }
  }

  const body: any = {
    model: model.modelName,
    input: {
      messages: [{ role: "user", content }],
    },
    parameters: {
      size,
      n: 1,
      prompt_extend: true,
      watermark: false,
    },
  };

  logger(`[DashScope图片生成] 请求模型: ${model.modelName}, 尺寸: ${size}`);

  const response = await axios.post(`${baseUrl}/services/aigc/multimodal-generation/generation`, body, { headers });
  const data = response.data;

  // 检查业务错误
  if (data?.code && data.code !== "OK") {
    throw new Error(`图片生成失败：${data.message || data.code}`);
  }

  // 同步返回：output.choices[].message.content[].image
  const choices = data?.output?.choices;
  if (choices && choices.length > 0) {
    for (const choice of choices) {
      for (const item of choice.message?.content ?? []) {
        if (item.type === "image" && item.image) {
          logger(`[DashScope图片生成] 成功，下载图片中...`);
          return await urlToBase64(item.image);
        }
      }
    }
  }

  // 异步模式：有 task_id 需要轮询
  const taskId = data?.output?.task_id;
  if (taskId) {
    logger(`[DashScope图片生成] 异步任务已创建, ID: ${taskId}`);

    const result = await pollTask(
      async (): Promise<PollResult> => {
        const queryResponse = await axios.get(`${baseUrl}/tasks/${taskId}`, {
          headers: { Authorization: headers.Authorization },
        });
        const task = queryResponse.data?.output || queryResponse.data;
        const status = task.task_status || task.status;

        logger(`[DashScope图片生成] 任务状态: ${status}`);

        if (status === "SUCCEEDED" || status === "completed") {
          const taskResults = task.results;
          if (taskResults && taskResults.length > 0 && taskResults[0].url) {
            return { completed: true, data: taskResults[0].url };
          }
          return { completed: true, error: "任务成功但未返回图片URL" };
        }

        if (status === "FAILED" || status === "failed") {
          return { completed: true, error: task.error?.message || task.message || "图片生成失败" };
        }

        return { completed: false };
      },
      5000,
      300000,
    );

    if (result.error) throw new Error(result.error);
    return await urlToBase64(result.data!);
  }

  throw new Error("图片生成失败：未返回有效结果");
};

const videoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  const baseUrl = getBaseUrl();
  const headers = getHeaders(true);

  const body: any = {
    model: model.modelName,
    input: {
      prompt: config.prompt || "",
    },
    parameters: {
      resolution: config.resolution || "720P",
      duration: config.duration,
      watermark: false,
    },
  };

  // 比例：DashScope 支持 ratio 参数
  if (config.aspectRatio) {
    body.parameters.ratio = config.aspectRatio;
  }

  // Wan2.7 专用参数
  if (model.modelName.startsWith("wan2.7")) {
    body.parameters.prompt_extend = true;
  }

  // 处理参考图片（图生视频 / 首帧模式）
  const mode = config.mode;
  if (typeof mode === "string" && mode !== "text") {
    // 首帧模式：取第一张图片作为首帧
    const images = config.referenceList?.filter((r: any) => r.type === "image") ?? [];
    if (images.length > 0) {
      body.input.first_frame_image = images[0].base64;
    }
    // 尾帧（如果有第二张）
    if ((mode === "startEndRequired" || mode === "endFrameOptional") && images.length > 1) {
      body.input.last_frame_image = images[1].base64;
    }
  } else if (Array.isArray(mode)) {
    // 多参考模式（HappyHorse R2V）
    const imageRefs = config.referenceList?.filter((r: any) => r.type === "image") ?? [];
    if (imageRefs.length > 0) {
      body.input.reference_images = imageRefs.map((r: any) => r.base64);
    }
  }

  logger(`[DashScope视频生成] 提交任务, 模型: ${model.modelName}, 时长: ${config.duration}s, 分辨率: ${config.resolution}`);

  // 步骤1: 创建异步任务
  const createResponse = await axios.post(`${baseUrl}/services/aigc/video-generation/video-synthesis`, body, { headers });
  const taskId = createResponse.data?.output?.task_id;

  if (!taskId) {
    const errMsg = createResponse.data?.message || createResponse.data?.code || "未返回任务ID";
    throw new Error(`视频生成任务创建失败：${errMsg}`);
  }

  logger(`[DashScope视频生成] 任务已创建, ID: ${taskId}`);

  // 步骤2: 轮询等待结果
  const result = await pollTask(
    async (): Promise<PollResult> => {
      const queryResponse = await axios.get(`${baseUrl}/tasks/${taskId}`, {
        headers: { Authorization: headers.Authorization },
      });
      const task = queryResponse.data?.output || queryResponse.data;

      const status = task.task_status || task.status;
      logger(`[DashScope视频生成] 任务状态: ${status}`);

      if (status === "SUCCEEDED" || status === "completed") {
        const videoUrl = task.video_url || task.result_url || task.results?.video?.url;
        if (videoUrl) {
          return { completed: true, data: videoUrl };
        }
        return { completed: true, error: "任务成功但未返回视频URL" };
      }

      if (status === "FAILED" || status === "failed") {
        return { completed: true, error: task.error?.message || task.message || "视频生成失败" };
      }

      if (status === "CANCELED" || status === "cancelled") {
        return { completed: true, error: "视频生成任务已取消" };
      }

      if (status === "UNKNOWN") {
        return { completed: true, error: "任务已过期(超过24小时)" };
      }

      // PENDING / RUNNING 继续等待
      return { completed: false };
    },
    10000, // 每10秒轮询
    600000 * 3, // 30分钟超时
  );

  if (result.error) {
    throw new Error(result.error);
  }

  // 步骤3: 下载视频并转base64
  // video_url 是OSS签名直链，下载时不带Authorization头
  return await urlToBase64(result.data!);
};

const ttsRequest = async (config: TTSConfig, model: TTSModel): Promise<string> => {
  return "";
};

const checkForUpdates = async (): Promise<{ hasUpdate: boolean; latestVersion: string; notice: string }> => {
  return { hasUpdate: false, latestVersion: "1.0", notice: "" };
};

const updateVendor = async (): Promise<string> => {
  return "";
};

// ============================================================
// 导出
// ============================================================

exports.vendor = vendor;
exports.textRequest = textRequest;
exports.imageRequest = imageRequest;
exports.videoRequest = videoRequest;
exports.ttsRequest = ttsRequest;
exports.checkForUpdates = checkForUpdates;
exports.updateVendor = updateVendor;

export {};
