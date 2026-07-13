/**
 * Based on Toonflow (https://github.com/HBAI-Ltd/Toonflow-app)
 * Original work Copyright (c) 2025 HBAI-Ltd
 * Licensed under Apache 2.0 with supplementary terms.
 *
 * Modified by roco-of-king, 2026
 * Added: 视频提示词检查接口
 */
import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";

const router = express.Router();

// 查询轨道提示词生成状态（轮询接口）
export default router.post(
  "/",
  validateFields({
    projectId: z.number(),
    scriptId: z.number(),
    trackIds: z.array(z.number()),
  }),
  async (req, res) => {
    const { trackIds } = req.body;
    const data = await u.db("o_videoTrack").whereIn("id", trackIds).select("id", "state", "prompt", "reason");
    res.status(200).send(success(data));
  },
);
