import express from "express";
import u from "@/utils";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
import { ReferenceList } from "@/utils/ai";
const router = express.Router();

type Type = "imageReference" | "startImage" | "endImage" | "videoReference" | "audioReference";
interface UploadItem {
  fileType: "image" | "video" | "audio";
  type: Type;
  sources?: "assets" | "storyboard";
  id?: number;
  src?: string;
  label?: string;
  prompt?: string;
}

export default router.post(
  "/",
  validateFields({
    projectId: z.number(),
    scriptId: z.number(),
    trackData: z.array(
      z.object({
        uploadData: z.array(
          z.object({
            id: z.number(),
            sources: z.string(),
          }),
        ),
        trackId: z.number(),
        prompt: z.string(),
        duration: z.number(),
        sourceVideoId: z.number().optional(),
      }),
    ),
    model: z.string(),
    mode: z.string(),
    resolution: z.string(),
    audio: z.boolean().optional(),
  }),
  async (req, res) => {
    const { scriptId, projectId, trackData, model, resolution, audio, mode } = req.body;

    let modeData = [];
    if (Array.isArray(mode)) {
    } else if (typeof mode === "string" && mode.startsWith('["') && mode.endsWith('"]')) {
      try {
        modeData = JSON.parse(mode);
      } catch (e) {}
    }

    // 获取生成视频比例
    const ratio = await u.db("o_project").select("videoRatio").where("id", projectId).first();

    // 为每个 track 预处理数据并插入数据库，返回任务列表
    const tasks = await Promise.all(
      (trackData as { uploadData: { id: number; sources: string }[]; trackId: number; prompt: string; duration: number; sourceVideoId?: number }[]).map(async (track) => {
        const { uploadData, trackId, prompt, duration, sourceVideoId } = track;

        // 查询出图片数据（根据 mode 选择不同的查询路径）
        const isDualFrame = (modeData.length > 0 ? modeData[0] : mode) === "firstLastFrame" || mode === "firstLastFrame";
        const images = await Promise.all(
          uploadData.map(async (item) => {
            if (item.sources === "storyboard") {
              if (isDualFrame) {
                const frameData = await u.db("o_storyboard")
                  .where("id", item.id)
                  .select("firstFramePath", "lastFramePath")
                  .first();
                return [
                  { path: frameData?.firstFramePath, sources: "firstFrame" },
                  { path: frameData?.lastFramePath, sources: "lastFrame" },
                ];
              }
              const filePath = await u.db("o_storyboard").where("id", item.id).select("filePath").first();
              return { path: filePath?.filePath, sources: "storyBoard" };
            }
            if (item.sources === "assets") {
              const filePath = await u
                .db("o_assets")
                .where("o_assets.id", item.id)
                .leftJoin("o_image", "o_assets.imageId", "o_image.id")
                .select("o_image.filePath", "o_image.type")
                .first();
              return { path: filePath?.filePath, sources: filePath.type };
            }
          }),
        );

        const videoPath = `/${projectId}/video/${uuidv4()}.mp4`;
        const activeMode = modeData.length > 0 ? modeData[0] : mode;
        const [videoId] = await u.db("o_video").insert({
          filePath: videoPath,
          time: Date.now(),
          state: "生成中",
          scriptId,
          projectId,
          videoTrackId: trackId,
          mode: typeof activeMode === "string" ? activeMode : "multiModal",
          generationRound: 1,
          userDeleted: 0,
        });

        return { videoId, videoPath, prompt, duration, images: images.flat(), trackId, sourceVideoId };
      }),
    );

    res.status(200).send(success(tasks.map((t) => ({ videoId: t.videoId, trackId: t.trackId }))));
    for (const { videoId, videoPath, prompt, duration, images, sourceVideoId } of tasks) {
      // 所有任务全部并发后台执行，完全不阻塞任何进程
      const base64 = await Promise.all(
        images.map(async (item) => {
          if (!item || !item.path) return null;
          return { base64: await u.oss.getImageBase64(item.path), type: item.sources == "audio" ? "audio" : "image" };
        }),
      );
      // 视频延长/编辑模式：加载源视频
      const activeMode = modeData.length > 0 ? modeData[0] : mode;
      if ((activeMode === "videoExtension" || activeMode === "videoEditing") && sourceVideoId) {
        const srcVideo = await u.db("o_video").where("id", sourceVideoId).select("filePath").first();
        if (srcVideo?.filePath) {
          try {
            const videoUrl = await u.oss.getFileUrl(srcVideo.filePath);
            base64.push({ base64: videoUrl, type: "video" });
          } catch { /* 跳过 */ }
        }
      }
      const relatedObjects = { projectId, videoId, scriptId, type: "视频" };
      const aiVideo = u.Ai.Video(model);
      aiVideo
        .run(
          {
            prompt,
            referenceList: base64.filter(Boolean) as ReferenceList[],
            mode: modeData.length > 0 ? modeData : mode,
            duration,
            aspectRatio: (ratio?.videoRatio as "16:9" | "9:16") || "16:9",
            resolution,
            audio,
          },
          {
            projectId,
            taskClass: "视频生成",
            describe: "根据提示词生成视频",
            relatedObjects: JSON.stringify(relatedObjects),
          },
        )
        .then(async () => await aiVideo.save(videoPath))
        .then(async () => await u.db("o_video").where("id", videoId).update({ state: "生成成功" }))
        .catch(async (error: any) => {
          await u
            .db("o_video")
            .where("id", videoId)
            .update({
              state: "生成失败",
              errorReason: u.error(error).message,
            });
        });
    }
  },
);
