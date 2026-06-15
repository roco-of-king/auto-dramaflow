import express from "express";
import { success, error } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
import u from "@/utils";
import { z } from "zod";
import { transform } from "sucrase";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    id: z.string(),
    inputValues: z.record(z.string(), z.string()),
  }),
  async (req, res) => {
    const { id, inputValues } = req.body;

    await u
      .db("o_vendorConfig")
      .where("id", id)
      .update({
        inputValues: JSON.stringify(inputValues),
      });
    res.status(200).send(success("更新成功"));
  },
);
