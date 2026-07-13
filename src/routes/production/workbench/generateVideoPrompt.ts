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
    trackId: z.number(),
    projectId: z.number(),
    info: z.array(
      z.object({
        id: z.number(),
        sources: z.string(),
      }),
    ),
    model: z.string(),
    mode: z.string(),
  }),
  async (req, res) => {
    const { trackId, projectId, info, model, mode } = req.body;

    //查询参数
    const images = await Promise.all(
      info.map(async (item: { id: number; sources: string }) => {
        if (item.sources === "storyboard") {
          // 查询分镜主信息
          const storyboard = await u
            .db("o_storyboard")
            .where("o_storyboard.id", item.id)
            .select("videoDesc", "prompt", "track", "duration", "shouldGenerateImage", "firstFrameState", "lastFrameState", "firstFramePrompt", "lastFramePrompt", "inTransitionDesc", "outTransitionDesc", "modelMode")
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
          firstFrameState: item.firstFrameState,
          lastFrameState: item.lastFrameState,
          firstFramePrompt: item.firstFramePrompt,
          lastFramePrompt: item.lastFramePrompt,
          inTransitionDesc: item.inTransitionDesc,
          outTransitionDesc: item.outTransitionDesc,
          modelMode: item.modelMode,
        });
    }
    const assetsNotAudioIds = assets.filter((i) => i.type == "audio").map((i) => i.id);

    const assets2Audio = await u
      .db("o_assets")
      .whereIn("o_assets.id", assetsNotAudioIds)
      .join("o_assetsRole2Audio", "o_assetsRole2Audio.assetsAudioId", "o_assets.assetsId")
      .select("o_assets.assetsId", "o_assets.id", "o_assetsRole2Audio.assetsAudioId", "o_assetsRole2Audio.assetsRoleId");

    const assetsAudioRecord: Record<number, number> = {};
    assets2Audio.forEach((i) => {
      assetsAudioRecord[i.assetsRoleId!] = i.id!;
    });

    const [id, modelData] = model.split(/:(.+)/);
    const projectData = await u.db("o_project").select("*").where({ id: projectId }).first();
    const videoPrompt = await u.db("o_prompt").where("type", "videoPromptGeneration").first();
    let videoPromptGeneration = "" as string | undefined;

    const modelPromptData = await u.db("o_modelPrompt").where("vendorId", id).where("model", modelData).first();
    //查询到 有绑定对应视频提示词
    if (modelPromptData) {
      const modelPromptRoot = u.getPath(["modelPrompt"]);
      try {
        const fullPath = path.join(modelPromptRoot, modelPromptData?.path!);
        const content = await fs.readFile(fullPath, "utf-8");
        videoPromptGeneration = content ?? "";
      } catch {}
    }

    // 未查询到绑定，根据模型名称 + mode 自动匹配 modelPrompt/video/ 下的文件
    if (!videoPromptGeneration) {
      const modelPromptRoot = u.getPath(["modelPrompt"]);
      const videoPromptDir = path.join(modelPromptRoot, "video");
      const modelLower = (modelData ?? "").toLowerCase();

      let fileName: string | null = null;

      if (modelLower.includes("wan") && modelLower.includes("2.6")) {
        // wan2.6 系列 => 单图首帧模式
        fileName = "wan2.6Single-imageFirstFrameMode.md";
      } else if (/seedance.*2[.\-]0/i.test(modelData)) {
        // seedance 2.0 系列 — 根据 mode 选择模板
        if (mode === "firstLastFrame" || mode === "startEndRequired") {
          fileName = "universalFirstAndLastFrameMode.md";
        } else if (mode === "videoExtension") {
          fileName = "seedance2VideoExtension.md";
        } else if (mode === "videoEditing") {
          fileName = "seedance2VideoEditing.md";
        } else {
          fileName = "seedance2Multi-parameterMode.md";
        }
      } else if (mode === "firstLastFrame" || mode === "startEndRequired" || mode === "endFrameOptional" || mode === "startFrameOptional" || mode === "firstFrame") {
        // 首尾帧相关模式 => 通用首尾帧模式
        fileName = "universalFirstAndLastFrameMode.md";
      } else if (mode === "videoExtension") {
        fileName = "seedance2VideoExtension.md";
      } else if (mode === "videoEditing") {
        fileName = "seedance2VideoEditing.md";
      } else if (typeof mode === "string" && mode.startsWith('["') && mode.endsWith('"]')) {
        // 数组模式 => 通用多参模式
        fileName = "universalMulti-parameterMode.md";
      } else if (mode === "multiModal") {
        fileName = "universalMulti-parameterMode.md";
      }
      if (fileName) {
        try {
          const fullPath = path.join(videoPromptDir, fileName);
          videoPromptGeneration = await fs.readFile(fullPath, "utf-8");
        } catch {
          // 文件不存在则忽略，继续用备选
        }
      }
    }

    // 尝试加载类型专属模板（如短剧情感/史诗电影/动画动作等），作为基础模板的补充
    let genreTemplate = "";
    if (videoPromptGeneration && /seedance/i.test(modelData)) {
      const projectType = (projectData?.type ?? "").trim();
      const genreMap: Record<string, string> = {
        "爱情": "seedance2ShortDramaEmotional.md",
        "言情": "seedance2ShortDramaEmotional.md",
        "霸总": "seedance2ShortDramaCEO.md",
        "逆袭": "seedance2ShortDramaCEO.md",
        "爽剧": "seedance2ShortDramaCEO.md",
        "喜剧": "seedance2SketchComedy.md",
        "搞笑": "seedance2SketchComedy.md",
        "科幻": "seedance2CinematicEpic.md",
        "史诗": "seedance2CinematicEpic.md",
        "动作": "seedance2CinematicEpic.md",
        "战争": "seedance2CinematicEpic.md",
        "悬疑": "seedance2CinematicNoir.md",
        "惊悚": "seedance2CinematicNoir.md",
        "文艺": "seedance2CinematicNoir.md",
        "动画": "seedance2AnimeAction.md",
        "动漫": "seedance2AnimeAction.md",
        "UGC": "seedance2UGCVlog.md",
        "Vlog": "seedance2UGCVlog.md",
      };
      let genreFile: string | null = null;
      for (const [keyword, file] of Object.entries(genreMap)) {
        if (projectType.includes(keyword)) { genreFile = file; break; }
      }
      if (genreFile) {
        try {
          const modelPromptRoot = u.getPath(["modelPrompt"]);
          genreTemplate = await fs.readFile(path.join(modelPromptRoot, "video", genreFile), "utf-8");
        } catch { /* 文件不存在则忽略 */ }
      }
    }

    //备选
    if (!videoPromptGeneration) {
      if (videoPrompt && videoPrompt.useData) {
        videoPromptGeneration = videoPrompt.useData;
      } else {
        videoPromptGeneration = videoPrompt?.data ?? undefined;
      }
    }

    const artStyle = projectData?.artStyle || "无";
          console.log("%c Line:158 🍢", "background:#ffdd4d",assets);

    const visualManual = u.getArtPrompt(artStyle, "art_skills", "art_storyboard_video");

    // 将类型专属模板追加到 system prompt（如果已加载）
    if (genreTemplate) {
      videoPromptGeneration = `${videoPromptGeneration}\n\n---\n\n## 附加：当前项目类型专属的提示词生成风格参考\n\n${genreTemplate}`;
    }

    const content = `
          **模型名称**：${modelData},

          **资产信息**（角色、场景、道具、音频):${assets
            .filter((i) => i.filePath)
            .map((i) => `[${i.id},${i.type},${i.name} ${assetsAudioRecord[i.id] ? `audio:${assetsAudioRecord[i.id]}` : ""} ] `)
            .join("，")},
          **分镜信息**：${storyboard.map(
            (i) => {
              const esc = (s: string) => s.replace(/'/g, "\\'").replace(/\n/g, "\\n");
              const extraAttrs = [
                i.firstFrameState ? `firstFrameState='${esc(i.firstFrameState)}'` : "",
                i.lastFrameState ? `lastFrameState='${esc(i.lastFrameState)}'` : "",
                i.firstFramePrompt ? `firstFramePrompt='${esc(i.firstFramePrompt)}'` : "",
                i.lastFramePrompt ? `lastFramePrompt='${esc(i.lastFramePrompt)}'` : "",
                i.inTransitionDesc ? `inTransitionDesc='${esc(i.inTransitionDesc)}'` : "",
                i.outTransitionDesc ? `outTransitionDesc='${esc(i.outTransitionDesc)}'` : "",
                i.modelMode ? `modelMode='${i.modelMode}'` : "",
              ].filter(Boolean).join("\n  ");
              return `<storyboardItem
  videoDesc='${esc(i.videoDesc)}'
  ${extraAttrs ? extraAttrs + "\n  " : ""}duration='${i.duration}'
></storyboardItem>`;
            },
          )},
          `;
    console.log("%c Line:156 🍬 content", "background:#4fff4B", content);

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
