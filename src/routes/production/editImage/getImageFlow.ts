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
  }),
  async (req, res) => {
    const { id, type } = req.body;
    const imageFlowData = await u.db("o_imageFlow").where("id", id).first();
    if (imageFlowData?.flowData) {
      const parseFlow = JSON.parse(imageFlowData.flowData);
      await Promise.all(
        parseFlow.nodes.map(async (node: any) => {
          if (node.type === "upload") {
            node.data.image = node.data.image ? await u.oss.getSmallImageUrl(node.data.image) : "";
          } else if (node.type === "generated") {
            node.data.generatedImage = node.data.generatedImage ? await u.oss.getSmallImageUrl(node.data.generatedImage) : "";

            node.data.references = await Promise.all(node.data.references.map(async (item: { image: string }) => {
              return {
                image: await u.oss.getSmallImageUrl(item.image)
              }
            }));
          }
        }),
      );
      return res.status(200).send(success({ ...parseFlow, id: imageFlowData.id }));
    }

    return res.status(200).send(success(null));
  },
);
