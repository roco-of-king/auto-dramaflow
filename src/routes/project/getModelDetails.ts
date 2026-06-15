import express from "express";
import { success, error } from "@/lib/responseFormat";
import u from "@/utils";
import { z } from "zod";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    key: z.enum(["scriptAgent", "productionAgent"]),
  }),
  async (req, res) => {
    const { key } = req.body;
    const data = await u.db("o_agentDeploy").select("o_agentDeploy.*").where("o_agentDeploy.key", key).first();
    const [id, modelName] = data ? data.modelName.split(/:(.+)/) : [];
    const models = await u.vendor.getModelList(id);
    const model = models.find((m) => m.modelName === modelName);
    if (!model) return res.status(400).send(error("未找到模型"));
    res.status(200).send(success(model));
  },
);
