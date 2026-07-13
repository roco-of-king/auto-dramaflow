/**
 * Based on Toonflow (https://github.com/HBAI-Ltd/Toonflow-app)
 * Original work Copyright (c) 2025 HBAI-Ltd
 * Licensed under Apache 2.0 with supplementary terms.
 *
 * Modified by roco-of-king, 2026
 * Added: 分镜图重置接口
 */
import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";

const router = express.Router();

export default router.post(
  "/",
  validateFields({
    storyboardId: z.number(),
  }),
  async (req, res) => {
    const { storyboardId } = req.body;

    const storyboard = await u.db("o_storyboard").where("id", storyboardId).first();
    if (!storyboard) return res.status(400).send({ message: "分镜不存在" });

    // 清空图片路径，状态改回未生成（允许重新上传或 AI 重生成）
    await u.db("o_storyboard").where("id", storyboardId).update({
      filePath: "",
      state: "未生成",
      reason: null,
    });

    res.status(200).send(
      success({
        storyboardId,
        message: "已重置，可重新上传或生成",
      }),
    );
  },
);
