import express from "express";
import u from "@/utils";
import { success } from "@/lib/responseFormat";
import { z } from "zod";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

// 获取生成图片
export default router.post(
  "/",
  validateFields({
    assetsId: z.number(),
  }),
  async (req, res) => {
    const { assetsId } = req.body;

    const assets = await u.db("o_assets").where("id", assetsId).select("id", "imageId", "type").first();

    const rawTempAssets = await u.db("o_image").where("assetsId", assetsId).select("id", "filePath", "assetsId", "type", "state");

    const tempAssets = await Promise.all(
      rawTempAssets.map(async (item) => ({
        ...item,
        filePath: item.filePath ? await u.oss.getSmallImageUrl(item.filePath) : "",
        selected: assets?.imageId != null && Number(item.id) === Number(assets.imageId),
      })),
    );

    const data = {
      id: assets!.id,
      imageId: assets!.imageId ?? null,
      tempAssets,
    };
    res.status(200).send(success(data));
  },
);
