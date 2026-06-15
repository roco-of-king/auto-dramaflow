import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    agentUseMode: z.string(),
  }),
  async (req, res) => {
    const { agentUseMode } = req.body;
    await u.db("o_setting").where("key", "agentUseMode").update({
      value: agentUseMode,
    });
    res.status(200).send(success("保存设置成功"));
  },
);
