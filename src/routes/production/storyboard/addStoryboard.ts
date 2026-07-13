import express from "express";
import u from "@/utils";
import { z } from "zod";
import { error, success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();
interface Storyboard {
  id: number;
  track: string;
  src: string | null;
  associateAssetsIds: number[];
  duration: number;
  state: string;
}
export default router.post(
  "/",
  validateFields({
    prompt: z.string(),
    duration: z.number(),
    state: z.string(),
    videoDesc: z.string(),
    shouldGenerateImage: z.number(),
    src: z.string().nullable(),
    scriptId: z.number(),
    projectId: z.number(),
    // 首尾帧扩展字段（可选）
    firstFrameState: z.string().optional(),
    lastFrameState: z.string().optional(),
    firstFramePrompt: z.string().optional(),
    lastFramePrompt: z.string().optional(),
    inTransitionDesc: z.string().optional(),
    outTransitionDesc: z.string().optional(),
    modelMode: z.string().optional(),
    extendsFromId: z.number().optional(),
  }),
  async (req, res) => {
    const { prompt, duration, state, src, scriptId, projectId, videoDesc, shouldGenerateImage, firstFrameState, lastFrameState, firstFramePrompt, lastFramePrompt, inTransitionDesc, outTransitionDesc, modelMode, extendsFromId } = req.body;
    const trackId = Date.now()
    await u.db("o_videoTrack").insert({
      id: trackId,
      scriptId: scriptId,
      projectId,
      modelMode: modelMode ?? null,
    });
    const [id] = await u.db("o_storyboard").insert({
      prompt,
      duration,
      state,
      filePath: u.replaceUrl(src),
      trackId,
      videoDesc,
      shouldGenerateImage: src ? 1 : 0,
      scriptId: scriptId,
      projectId: projectId,
      firstFrameState: firstFrameState ?? null,
      lastFrameState: lastFrameState ?? null,
      firstFramePrompt: firstFramePrompt ?? null,
      lastFramePrompt: lastFramePrompt ?? null,
      inTransitionDesc: inTransitionDesc ?? null,
      outTransitionDesc: outTransitionDesc ?? null,
      modelMode: modelMode ?? null,
      extendsFromId: extendsFromId ?? null,
    });
    return res.status(200).send(success({ id }));
  },
);
