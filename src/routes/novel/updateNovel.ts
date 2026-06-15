import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

// 更新原文数据
export default router.post(
  "/",
  validateFields({
    id: z.number(),
    index: z.union([z.number(), z.string()]),
    reel: z.string(),
    chapter: z.string(),
    chapterData: z.string(),
    event: z.string(),
  }),
  async (req, res) => {
    const { id, index, reel, chapter, chapterData, event } = req.body;

    await u.db("o_novel").where("id", id).update({
      chapterIndex: index,
      reel,
      chapter,
      chapterData,
      event: event,
    });

    res.status(200).send(success({ message: "更新原文成功" }));
  },
);
