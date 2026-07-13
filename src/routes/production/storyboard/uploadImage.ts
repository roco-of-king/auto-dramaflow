/**
 * Based on Toonflow (https://github.com/HBAI-Ltd/Toonflow-app)
 * Original work Copyright (c) 2025 HBAI-Ltd
 * Licensed under Apache 2.0 with supplementary terms.
 *
 * Modified by roco-of-king, 2026
 * Added: 分镜图上传接口
 */
import express from "express";
import u from "@/utils";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";

const router = express.Router();

export default router.post(
  "/",
  validateFields({
    storyboardId: z.number(),
    imageBase64: z.string(),
  }),
  async (req, res) => {
    const { storyboardId, imageBase64 } = req.body;

    // 1. 查分镜记录，获取 projectId
    const storyboard = await u.db("o_storyboard").where("id", storyboardId).first();
    if (!storyboard) return res.status(400).send({ message: "分镜不存在" });

    // 2. 确保 base64 有正确前缀
    const normalized = imageBase64.startsWith("data:") ? imageBase64 : `data:image/png;base64,${imageBase64}`;

    // 3. 图片存到 OSS（分镜图存在 assets 目录下）
    const imagePath = `/${storyboard.projectId}/assets/${storyboard.scriptId}/${uuidv4()}.jpg`;
    await u.oss.writeFile(imagePath, normalized);

    // 4. 更新分镜记录
    await u.db("o_storyboard").where("id", storyboardId).update({
      filePath: imagePath,
      state: "已完成",
    });

    // 5. 获取缩略图
    const smallImageUrl = await u.oss.getSmallImageUrl(imagePath);

    res.status(200).send(
      success({
        storyboardId,
        filePath: imagePath,
        smallImageUrl,
        message: "上传成功",
      }),
    );
  },
);
