import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
import { id } from "zod/locales";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    id: z.number(),
    prompt: z.string().optional(),
    videoDesc: z.string().optional(),
    // 首尾帧扩展字段（可选）
    firstFrameState: z.string().optional(),
    lastFrameState: z.string().optional(),
    firstFramePrompt: z.string().optional(),
    lastFramePrompt: z.string().optional(),
    inTransitionDesc: z.string().optional(),
    outTransitionDesc: z.string().optional(),
    modelMode: z.string().optional(),
    extendsFromId: z.number().optional(),
    firstFramePath: z.string().optional(),
    lastFramePath: z.string().optional(),
  }),
  async (req, res) => {
    const { id, prompt, videoDesc, firstFrameState, lastFrameState, firstFramePrompt, lastFramePrompt, inTransitionDesc, outTransitionDesc, modelMode, extendsFromId, firstFramePath, lastFramePath } = req.body;
    const updateData: Record<string, any> = {};
    if (prompt !== undefined) updateData.prompt = prompt;
    if (videoDesc !== undefined) updateData.videoDesc = videoDesc;
    if (firstFrameState !== undefined) updateData.firstFrameState = firstFrameState;
    if (lastFrameState !== undefined) updateData.lastFrameState = lastFrameState;
    if (firstFramePrompt !== undefined) updateData.firstFramePrompt = firstFramePrompt;
    if (lastFramePrompt !== undefined) updateData.lastFramePrompt = lastFramePrompt;
    if (inTransitionDesc !== undefined) updateData.inTransitionDesc = inTransitionDesc;
    if (outTransitionDesc !== undefined) updateData.outTransitionDesc = outTransitionDesc;
    if (modelMode !== undefined) updateData.modelMode = modelMode;
    if (extendsFromId !== undefined) updateData.extendsFromId = extendsFromId;
    if (firstFramePath !== undefined) updateData.firstFramePath = u.replaceUrl(firstFramePath);
    if (lastFramePath !== undefined) updateData.lastFramePath = u.replaceUrl(lastFramePath);
    await u.db("o_storyboard").where({ id }).update(updateData);
    res.status(200).send(success({ message: "更新提示词成功" }));
  },
);
