import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    projectId: z.number(),
  }),
  async (req, res) => {
    const { projectId } = req.body;
    const data = await u.db("o_novel").where("projectId", projectId).select("id", "chapterIndex as index", "chapter").orderBy("chapterIndex", "asc");

    res.status(200).send(success(data));
  },
);
