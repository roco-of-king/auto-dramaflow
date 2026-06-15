import express from "express";
import { success } from "@/lib/responseFormat";
import u from "@/utils";
import { z } from "zod";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    projectId: z.number(),
    agentType: z.enum(["scriptAgent"]),
    data: z.object({
      storySkeleton: z.string(),
      adaptationStrategy: z.string(),
    }),
  }),
  async (req, res) => {
    const { projectId, agentType, data } = req.body;
    await u
      .db("o_agentWorkData")
      .where({ projectId: projectId, key: agentType })
      .update({
        data: JSON.stringify(data),
      });
    const script = data.script;

    await Promise.all(
      script.map(async (s: any) => {
        const row = await u.db("o_script").where({ projectId, name: s.name }).first();
        if (row) {
          await u.db("o_script").where({ id: row.id }).update({ content: s.content });
        } else {
          await u.db("o_script").insert({ projectId, name: s.name, content: s.content });
        }
      }),
    );

    res.status(200).send(success());
  },
);
