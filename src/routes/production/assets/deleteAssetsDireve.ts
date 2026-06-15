import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    id: z.number(),
    projectId: z.number(),
  }),
  async (req, res) => {
    const { id, projectId } = req.body;
    const assetsFirstData = await u.db("o_assets").where("id", id).first();
    if (!assetsFirstData) {
      return res.status(404).send({ error: "资源未找到" });
    }
    if (assetsFirstData?.flowId) await u.db("o_imageFlow").where("id", assetsFirstData?.flowId).delete();
    await u.db("o_assets").where("id", id).delete();
    await u.db("o_assets2Storyboard").where("assetId", id).delete();
    res.status(200).send(success({ message: "视频删除成功" }));
  },
);
