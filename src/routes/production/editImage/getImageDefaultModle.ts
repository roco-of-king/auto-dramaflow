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
    const imageFlowData = await u.db("o_project").where("id", projectId).select("imageModel", "imageQuality").first();
    return res.status(200).send(success(imageFlowData));
  },
);
