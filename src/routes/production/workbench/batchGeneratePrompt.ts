import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success, error } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
import fs from "fs/promises";
import path from "path";
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
    mode: z.string().optional(),
    concurrentCount: z.number().optional(),
  }),
  async (req, res) => {
    const { trackData, projectId, model } = req.body;

    // 公共数据：只需查一次
    const [vendorId, modelData] = model.split(/:(.+)/);
    const projectData = await u.db("o_project").select("*").where({ id: projectId }).first();
    const videoPrompt = await u.db("o_prompt").where("type", "videoPromptGeneration").first();
    let videoPromptGeneration = videoPrompt?.useData || videoPrompt?.data || "";
    const artStyle = projectData?.artStyle || "无";
    const visualManual = u.getArtPrompt(artStyle, "art_skills", "art_storyboard_video");

    // 尝试加载类型专属模板（如短剧情感/史诗电影等），追加到基础模板
    const [vendorId2, modelData2] = model.split(/:(.+)/);
    if (/seedance/i.test(modelData2)) {
      const projectType = (projectData?.type ?? "").trim();
      const genreMap: Record<string, string> = {
        "爱情": "seedance2ShortDramaEmotional.md", "言情": "seedance2ShortDramaEmotional.md",
        "霸总": "seedance2ShortDramaCEO.md", "逆袭": "seedance2ShortDramaCEO.md", "爽剧": "seedance2ShortDramaCEO.md",
        "喜剧": "seedance2SketchComedy.md", "搞笑": "seedance2SketchComedy.md",
        "科幻": "seedance2CinematicEpic.md", "史诗": "seedance2CinematicEpic.md", "动作": "seedance2CinematicEpic.md", "战争": "seedance2CinematicEpic.md",
        "悬疑": "seedance2CinematicNoir.md", "惊悚": "seedance2CinematicNoir.md", "文艺": "seedance2CinematicNoir.md",
        "动画": "seedance2AnimeAction.md", "动漫": "seedance2AnimeAction.md",
        "UGC": "seedance2UGCVlog.md", "Vlog": "seedance2UGCVlog.md",
      };
      for (const [keyword, file] of Object.entries(genreMap)) {
        if (projectType.includes(keyword)) {
          try {
            const modelPromptRoot = u.getPath(["modelPrompt"]);
            const genreContent = await fs.readFile(path.join(modelPromptRoot, "video", file), "utf-8");
            videoPromptGeneration = `${videoPromptGeneration}\n\n---\n\n## 附加：当前项目类型专属的提示词生成风格参考\n\n${genreContent}`;
          } catch { /* 忽略 */ }
          break;
        }
      }
    }

    const results: { trackId: number; prompt: string; error?: string }[] = [];

    for (const track of trackData) {
      const { trackId, info } = track;
      if (!info || !info.length) {
        results.push({ trackId, prompt: "", error: "该轨道无分镜数据" });
        continue;
      }

      const images = await Promise.all(
        info.map(async (item: { id: number; sources: string }) => {
          if (item.sources === "storyboard") {
            const storyboard = await u.db("o_storyboard")
              .where("o_storyboard.id", item.id)
              .select("videoDesc", "prompt", "track", "duration", "shouldGenerateImage")
              .first();
            const assetRows = await u.db("o_assets2Storyboard").where("storyboardId", item.id).orderBy("rowid").select("assetId");
            return { ...storyboard, associateAssetsIds: assetRows.map((r: any) => r.assetId), _type: "storyboard" as const };
          }
          if (item.sources === "assets") {
            const assetsData = await u.db("o_assets")
              .leftJoin("o_image", "o_image.id", "o_assets.imageId")
              .where("o_assets.id", item.id)
              .select("o_assets.id", "o_assets.type", "o_assets.name", "o_image.filePath")
              .first();
            return { ...assetsData, _type: "assets" as const };
          }
          return null;
        }),
      );

      const assets: any[] = [];
      const storyboard: any[] = [];
      for (const item of images) {
        if (!item) continue;
        if (item._type === "assets") assets.push({ id: item.id, type: item.type, name: item.name, filePath: item.filePath });
        if (item._type === "storyboard") storyboard.push({
          videoDesc: item.videoDesc,
          prompt: item.prompt,
          track: item.track,
          duration: item.duration,
          associateAssetsIds: item.associateAssetsIds,
          shouldGenerateImage: item.shouldGenerateImage,
        });
      }

      const content = `**模型名称**：${modelData},
**资产信息**（角色、场景、道具、音频):${assets.filter((i) => i.filePath).map((i) => `[${i.id},${i.type},${i.name}]`).join("，")},
**分镜信息**：${storyboard.map((i) => `<storyboardItem videoDesc='${i.videoDesc}' duration='${i.duration}'></storyboardItem>`)}`;

      try {
        const { text } = await u.Ai.Text("universalAi").invoke({
          system: videoPromptGeneration,
          messages: [
            { role: "assistant", content: visualManual },
            { role: "user", content },
          ],
        });
        await u.db("o_videoTrack").where({ id: trackId }).update({ prompt: text });
        results.push({ trackId, prompt: text });
      } catch (e) {
        results.push({ trackId, prompt: "", error: u.error(e).message });
      }
    }

    const failed = results.filter(r => r.error);
    if (failed.length === results.length) {
      res.status(400).send(error(failed.map(r => `轨道${r.trackId}: ${r.error}`).join("; ")));
    } else {
      res.status(200).send(success(results));
    }
  },
);
