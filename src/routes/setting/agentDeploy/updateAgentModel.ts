/**
 * Based on Toonflow (https://github.com/HBAI-Ltd/Toonflow-app)
 * Original work Copyright (c) 2025 HBAI-Ltd
 * Licensed under Apache 2.0 with supplementary terms.
 *
 * Modified by roco-of-king, 2026
 * Added: Agent模型动态更新接口
 */
import express from "express";
import { success } from "@/lib/responseFormat";
import u from "@/utils";
import { z } from "zod";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    id: z.number(),
    name: z.string(),
    model: z.string(),
    modelName: z.string(),
    vendorId: z.string().nullable(),
    desc: z.string(),
    temperature: z.number().optional(),
    maxOutputTokens: z.number().optional(),
  }),
  async (req, res) => {
    const { id, name, model, modelName, vendorId, desc, temperature, maxOutputTokens } = req.body;
    await u.db("o_agentDeploy").where({ id }).update({ id, name, model, modelName, vendorId, desc, temperature, maxOutputTokens });
    res.status(200).send(success("配置成功"));
  },
);
