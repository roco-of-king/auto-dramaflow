/**
 * Based on Toonflow (https://github.com/HBAI-Ltd/Toonflow-app)
 * Original work Copyright (c) 2025 HBAI-Ltd
 * Licensed under Apache 2.0 with supplementary terms.
 *
 * Modified by roco-of-king, 2026
 * Added: 独立素材上传接口
 */
import express from "express";
import u from "@/utils";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";

const router = express.Router();

const typeDirMap: Record<string, string> = {
  role: "role",
  scene: "scene",
  tool: "props",
  storyboard: "storyboard",
};

export default router.post(
  "/",
  validateFields({
    projectId: z.number(),
    type: z.enum(["role", "scene", "tool", "storyboard"]),
    name: z.string().optional().nullable(),
    describe: z.string().optional().nullable(),
    prompt: z.string().optional().nullable(),
    assetId: z.number().optional().nullable(),
    imageBase64: z.string(),
  }),
  async (req, res) => {
    const { projectId, type, name, describe, prompt, assetId, imageBase64 } = req.body;

    const dir = typeDirMap[type];
    if (!dir) return res.status(400).send({ message: "不支持的素材类型" });

    // 确保 base64 有正确前缀
    const normalized = imageBase64.startsWith("data:") ? imageBase64 : `data:image/png;base64,${imageBase64}`;

    // 图片存到 OSS
    const imagePath = `/${projectId}/${dir}/${uuidv4()}.jpg`;
    await u.oss.writeFile(imagePath, normalized);

    let finalAssetsId: number;

    if (assetId) {
      // 模式一：关联已有素材
      const existing = await u.db("o_assets").where("id", assetId).first();
      if (!existing) return res.status(400).send({ message: "素材不存在" });

      finalAssetsId = assetId;
    } else {
      // 模式二：新建素材
      if (!name || !describe) return res.status(400).send({ message: "新建素材需要提供 name 和 describe" });

      const [newId] = await u.db("o_assets").insert({
        name,
        describe,
        type,
        projectId,
        prompt: prompt ?? null,
        startTime: Date.now(),
      });
      finalAssetsId = newId;
    }

    // 建 o_image 记录，关联到素材
    const [imageId] = await u.db("o_image").insert({
      type,
      state: "已完成",
      assetsId: finalAssetsId,
      filePath: imagePath,
    });

    // 将素材的当前图片设为本张
    await u.db("o_assets").where("id", finalAssetsId).update({ imageId });

    // 获取缩略图
    const smallImageUrl = await u.oss.getSmallImageUrl(imagePath);

    res.status(200).send(
      success({
        assetsId: finalAssetsId,
        imageId,
        filePath: imagePath,
        smallImageUrl,
        message: assetId ? "已关联到素材" : "新建素材并上传成功",
      }),
    );
  },
);
