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
    name: z.string().optional(),
  }),
  async (req, res) => {
    const { projectId, name } = req.body;
    let query = u.db("o_script").where("projectId", projectId).select("*");
    if (name) {
      query = query.andWhere("name", "like", `%${name}%`);
    }

    const data = await query;
    const assetsData = await u
      .db("o_assets")
      .leftJoin("o_scriptAssets", "o_assets.id", "o_scriptAssets.assetId")
      .whereIn(
        "o_scriptAssets.scriptId",
        data.map((i) => i.id!),
      )
      .select("o_assets.id", "o_assets.name", "o_scriptAssets.scriptId");
    const scriptAssetsMap: Record<number, { id: number; name: string }[]> = {};
    assetsData.forEach((i) => {
      if (scriptAssetsMap[i.scriptId]) {
        scriptAssetsMap[i.scriptId].push({ id: i.id, name: i.name });
      } else {
        scriptAssetsMap[i.scriptId] = [{ id: i.id, name: i.name }];
      }
    });
    const returnData = data.map((i) => ({
      id: i.id,
      name: i.name,
      content: i.content,
      extractState: i.extractState,
      errorReason: i.errorReason,
      createTime: i.createTime,
      relatedAssets: scriptAssetsMap[i.id!] || [],
    }));
    res.status(200).send(success(returnData));
  },
);
