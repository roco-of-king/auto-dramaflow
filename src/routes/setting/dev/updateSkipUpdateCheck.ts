import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";

const router = express.Router();

export default router.post(
  "/",
  validateFields({
    skipUpdateCheck: z.string(),
  }),
  async (req, res) => {
    const { skipUpdateCheck } = req.body;
    const existing = await u.db("o_setting").where("key", "skipUpdateCheck").first();
    if (existing) {
      await u.db("o_setting").where("key", "skipUpdateCheck").update({ value: skipUpdateCheck });
    } else {
      await u.db("o_setting").insert({ key: "skipUpdateCheck", value: skipUpdateCheck });
    }
    res.status(200).send(success("保存设置成功"));
  },
);
