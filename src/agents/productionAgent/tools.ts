import { tool, jsonSchema, Tool } from "ai";
import { z } from "zod";
import _ from "lodash";
import ResTool from "@/socket/resTool";
import u from "@/utils";

const deriveAssetSchema = z.object({
  id: z.number().describe("衍生资产ID,如果新增则为空"),
  assetsId: z.number().describe("关联的资产ID"),
  prompt: z.string().describe("生成提示词"),
  name: z.string().describe("衍生资产名称"),
  desc: z.string().describe("衍生资产描述"),
  src: z.string().nullable().describe("衍生资产资源路径"),
  state: z.enum(["未生成", "生成中", "已完成", "生成失败"]).describe("衍生资产生成状态"),
  type: z.enum(["role", "tool", "scene", "clip"]).describe("衍生资产类型"),
});
export const assetItemSchema = z.object({
  id: z.number().describe("资产唯一标识"),
  name: z.string().describe("资产名称"),
  type: z.enum(["role", "tool", "scene", "clip"]).describe("资产类型"),
  prompt: z.string().describe("生成提示词"),
  desc: z.string().describe("资产描述"),
  derive: z.array(deriveAssetSchema).describe("衍生资产列表"),
});
const storyboardSchema = z.object({
  id: z.number().describe("分镜ID，必须为真实id"),
  duration: z.number().describe("持续时长(秒)"),
  prompt: z.string().describe("生成提示词"),
  associateAssetsIds: z.array(z.number()).describe("关联资产ID列表"),
  src: z.string().nullable().describe("分镜资源路径"),
  index: z.number().nullable().optional().describe("分镜排序字段"),
});
const workbenchDataSchema = z.object({
  name: z.string().describe("项目名称"),
  duration: z.string().describe("视频时长"),
  resolution: z.string().describe("分辨率"),
  fps: z.string().describe("帧率"),
  cover: z.string().optional().describe("封面图片路径"),
  gradient: z.string().optional().describe("渐变色配置"),
});
const posterItemSchema = z.object({
  id: z.number().describe("海报ID"),
  image: z.string().describe("海报图片路径"),
});
export const flowDataSchema = z.object({
  script: z.string().describe("剧本内容"),
  scriptPlan: z.string().describe("拍摄计划"),
  assets: z.array(assetItemSchema).describe("衍生资产"),
  storyboardTable: z.string().describe("分镜表"),
  storyboard: z.array(storyboardSchema).describe("分镜面板"),
});

export type FlowData = z.infer<typeof flowDataSchema>;

const keySchema = z.enum(Object.keys(flowDataSchema.shape) as [keyof FlowData, ...Array<keyof FlowData>]);
const flowDataKeyLabels = Object.fromEntries(
  Object.entries(flowDataSchema.shape).map(([key, schema]) => [key, (schema as z.ZodTypeAny).description ?? key]),
) as Record<keyof FlowData, string>;

interface ToolConfig {
  resTool: ResTool;
  toolsNames?: string[];
  msg: ReturnType<ResTool["newMessage"]>;
}

export default (toolCpnfig: ToolConfig) => {
  const { resTool, toolsNames, msg } = toolCpnfig;
  const { socket } = resTool;
  const tools: Record<string, Tool> = {
    get_flowData: tool({
      description: "获取工作区数据",
      inputSchema: jsonSchema<{ key: keyof FlowData }>(
        z
          .object({
            key: keySchema.describe("数据key"),
          })
          .toJSONSchema(),
      ),
      execute: async ({ key }) => {
        const thinking = msg.thinking(`正在获取${flowDataKeyLabels[key]}工作区数据...`);
        console.log("[tools] get_flowData", key);
        const flowData: FlowData = await new Promise((resolve) => socket.emit("getFlowData", { key }, (res: any) => resolve(res)));
        thinking.appendText(`获取到${flowDataKeyLabels[key]}:\n` + JSON.stringify(flowData[key], null, 2));
        thinking.updateTitle(`获取${flowDataKeyLabels[key]}完成`);
        thinking.complete();
        return flowData[key];
      },
    }),
    add_deriveAsset: tool({
      description: "新增或更新衍生资产",
      inputSchema: jsonSchema<{ assetsId: number; id: number | null; name: string; desc: string }>(
        z
          .object({
            assetsId: z.number().describe("关联的资产ID"),
            id: z.number().nullable().describe("衍生资产ID,如果新增则为空"),
            name: z.string().describe("衍生资产名称"),
            desc: z.string().describe("衍生资产描述"),
          })
          .toJSONSchema(),
      ),
      execute: async (raw) => {
        // 容错：LLM 偶尔传 "null" 字符串或空串，统一规范为 null
        const idRaw = raw.id as unknown;
        const normalizedId = idRaw === "null" || idRaw === "" || idRaw === undefined ? null : (idRaw as number | null);
        const deriveAsset = { ...raw, id: normalizedId };

        const thinking = msg.thinking("正在操作资产...");
        const { projectId, scriptId } = resTool.data;
        const startTime = Date.now();
        const parentAssets = await u.db("o_assets").where("id", deriveAsset.assetsId).select("id", "type").first();
        if (!parentAssets) return "关联的资产不存在";

        const data = {
          id: deriveAsset.id ?? undefined,
          assetsId: deriveAsset.assetsId,
          projectId,
          name: deriveAsset.name,
          type: parentAssets.type,
          describe: deriveAsset.desc,
          startTime,
        };
        if (deriveAsset.id) {
          await u.db("o_assets").where("id", deriveAsset.id).update(data);
          thinking.appendText(`已更新衍生资产，ID: ${deriveAsset.id}\n`);
        } else {
          const [insertedId] = await u.db("o_assets").insert(data);
          data.id = insertedId;
          await u.db("o_scriptAssets").insert({ scriptId, assetId: insertedId });
          thinking.appendText(`已新增衍生资产，ID: ${insertedId}\n`);
        }
        const res = await new Promise((resolve) => socket.emit("addDeriveAsset", data, (res: any) => resolve(res)));
        thinking.updateTitle("资产操作完成");
        thinking.complete();
        return res ?? "操作成功";
      },
    }),
    del_deriveAsset: tool({
      description: "删除衍生资产",
      inputSchema: jsonSchema<{ assetsId: number; id: number }>(
        z
          .object({
            assetsId: z.number().describe("关联的资产ID"),
            id: z.number().describe("衍生资产ID"),
          })
          .toJSONSchema(),
      ),
      execute: async ({ assetsId, id }) => {
        const thinking = msg.thinking("正在操作资产...");
        const { scriptId } = resTool.data;
        await u.db("o_assets").where("id", id).del();
        await u.db("o_scriptAssets").where({ scriptId, assetId: id }).del();
        thinking.appendText(`已删除衍生资产，ID: ${id}\n`);
        const res = await new Promise((resolve) => socket.emit("delDeriveAsset", { assetsId, id }, (res: any) => resolve(res)));
        thinking.updateTitle("资产操作完成");
        thinking.complete();
        return res ?? "删除成功";
      },
    }),
    generate_deriveAsset: tool({
      description: "生成衍生资产图片",
      inputSchema: jsonSchema<{ ids: number[] }>(
        z
          .object({
            ids: z.array(z.number()).describe("需要生成的 衍生资产ID"),
          })
          .toJSONSchema(),
      ),
      execute: async ({ ids }) => {
        const thinking = msg.thinking("正在生成衍生资产...");
        new Promise((resolve) => socket.emit("generateDeriveAsset", { ids }, (res: any) => resolve(res)))
          .then((res) => {
            thinking.appendText(`已生成衍生资产，ID: ${JSON.stringify(res, null, 2)}\n`);
            thinking.updateTitle("衍生资产开始完成");
            thinking.complete();
          })
          .catch((e) => {
            thinking.appendText("衍生资产生成失败:\n" + u.error(e).message);
            thinking.updateTitle("衍生资产生成失败");
            thinking.complete();
          });

        return "开始生成衍生资产";
      },
    }),
    generate_storyboard: tool({
      description: "生成分镜图片",
      inputSchema: jsonSchema<{ ids: number[] }>(
        z
          .object({
            ids: z.array(z.number()).describe("必须获取真实的分镜ID，支持批量生成"),
          })
          .toJSONSchema(),
      ),
      execute: async ({ ids }) => {
        const thinking = msg.thinking("正在生成分镜...");
        new Promise((resolve) => socket.emit("generateStoryboard", { ids }, (res: any) => resolve(res)))
          .then((res) => {
            thinking.appendText("生成的分镜数据:\n" + JSON.stringify(res, null, 2));
            thinking.updateTitle("分镜生成完成");
            thinking.complete();
          })
          .catch((e) => {
            thinking.appendText("分镜生成失败:\n" + u.error(e).message);
            thinking.updateTitle("分镜生成失败");
            thinking.complete();
          });

        return "开始生成分镜";
      },
    }),
  };

  return toolsNames ? Object.fromEntries(Object.entries(tools).filter(([n]) => toolsNames.includes(n))) : tools;
};
