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
    prompt: z.string().optional(),
  }),
  async (req, res) => {
    const { id, prompt, duration } = req.body;
    await u.db("o_videoTrack").where("id", id).update({
      prompt,
    });
    res.status(200).send(success("更新成功"));
  },
);
