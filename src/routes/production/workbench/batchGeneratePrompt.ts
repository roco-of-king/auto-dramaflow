import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success, error } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
import { info } from "node:console";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    projectId: z.number(),
    trackData: z.array(
      z.object({
        trackId: z.number(),
        info: z.array(
          z.object({
            id: z.number(),
            sources: z.string(),
          }),
        ),
      }),
    ),
    model: z.string(),
  }),
  async (req, res) => {
    const { trackId, projectId, info, model } = req.body;
    //查询参数
    const images = await Promise.all(
      info.map(async (item: { id: number; sources: string }) => {
        if (item.sources === "storyboard") {
          // 查询分镜主信息
          const storyboard = await u
            .db("o_storyboard")
            .where("o_storyboard.id", item.id)
            .select("videoDesc", "prompt", "track", "duration", "shouldGenerateImage")
            .first();
          // 查询分镜关联的资产ID
          const assetRows = await u.db("o_assets2Storyboard").where("storyboardId", item.id).orderBy("rowid").select("assetId");
          const associateAssetsIds = assetRows.map((row: any) => row.assetId);
          return {
            ...storyboard,
            associateAssetsIds,
            _type: "storyboard", // 标记类型，便于后续区分
          };
        }
        if (item.sources === "assets") {
          // 查询素材
          const assetsData = await u
            .db("o_assets")
            .leftJoin("o_image", "o_image.id", "o_assets.imageId")
            .where("o_assets.id", item.id)
            .select("o_assets.id", "o_assets.type", "o_assets.name", "o_image.filePath")
            .first();
          return {
            ...assetsData,
            _type: "assets", // 标记类型
          };
        }
      }),
    );

    // 拆分 assets 和 storyboard
    const assets: any[] = [];
    const storyboard: any[] = [];
    for (const item of images) {
      if (!item) continue; // 忽略空
      if (item._type === "assets")
        assets.push({
          id: item.id,
          type: item.type,
          name: item.name,
          filePath: item.filePath,
        });
      if (item._type === "storyboard")
        storyboard.push({
          videoDesc: item.videoDesc,
          prompt: item.prompt,
          track: item.track,
          duration: item.duration,
          associateAssetsIds: item.associateAssetsIds,
          shouldGenerateImage: item.shouldGenerateImage,
        });
    }

    const [id, modelData] = model.split(/:(.+)/);
    const projectData = await u.db("o_project").select("*").where({ id: projectId }).first();
    const videoPrompt = await u.db("o_prompt").where("type", "videoPromptGeneration").first();
    let videoPromptGeneration = "" as string | undefined;
    if (videoPrompt && videoPrompt.useData) {
      videoPromptGeneration = videoPrompt.useData;
    } else {
      videoPromptGeneration = videoPrompt?.data ?? undefined;
    }
    const artStyle = projectData?.artStyle || "无";
    const visualManual = u.getArtPrompt(artStyle, "art_skills", "art_storyboard_video");
    const content = `
          **模型名称**：${modelData},
          **资产信息**（角色、场景、道具、音频):${assets
            .filter((i) => i.filePath)
            .map((i) => `[${i.id},${i.type},${i.name}]`)
            .join("，")},
          **分镜信息**：${storyboard.map(
            (i) => `<storyboardItem
  videoDesc='${i.videoDesc}'
  duration='${i.duration}'
></storyboardItem>`,
          )},
          `;

    try {
      const { text } = await u.Ai.Text("universalAi").invoke({
        system: videoPromptGeneration,
        messages: [
          {
            role: "assistant",
            content: `${visualManual}`,
          },
          {
            role: "user",
            content: content,
          },
        ],
      });
      await u.db("o_videoTrack").where({ id: trackId }).update({
        prompt: text,
      });
      res.status(200).send(success(text));
    } catch (e) {
      res.status(400).send(error(u.error(e).message));
    }
  },
);
