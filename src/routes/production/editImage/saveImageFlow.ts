import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    edges: z.any(),
    nodes: z.any(),
  }),
  async (req, res) => {
    const { edges, nodes } = req.body;
    nodes.forEach((node: any) => {
      if (node.type == "upload") {
        node.data.image = node.data.image ? u.replaceUrl(node.data.image) : "";
      }

      if (node.type == "generated") {
        node.data.generatedImage = node.data.generatedImage ? u.replaceUrl(node.data.generatedImage) : "";
        node.data.references.forEach((item: { image: string }) => {
          item.image = item.image ? u.replaceUrl(item.image) : "";
        });
      }
    });
    const [insertFlowId] = await u.db("o_imageFlow").insert({
      flowData: JSON.stringify({ edges, nodes }),
    });
    return res.status(200).send(success({ id: insertFlowId }));
  },
);
