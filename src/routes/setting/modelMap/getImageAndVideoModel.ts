import express from "express";
import u from "@/utils";
import { success } from "@/lib/responseFormat";
const router = express.Router();

export default router.post("/", async (req, res) => {
  const dataList = await u.db("o_vendorConfig").select("id").where("enable", 1);
  if (!dataList || dataList.length === 0) {
    return res.status(404).send({ error: "模型未找到" });
  }
  const data = await Promise.all(
    dataList.map(async (item) => {
      const vendor = u.vendor.getVendor(item.id!);
      const promptList = await u.db("o_modelPrompt").andWhere("vendorId", vendor.id).select("*");
      const promptMap = new Map(promptList.map((p) => [p.model, { fileName: p.fileName, path: p.path }]));
      const models = await u.vendor.getModelList(item.id!);
      const filteredModels = models
        .filter((m: any) => m.type === "video")
        .map((m: any) => ({
          name: m.name,
          type: m.type as "image" | "video",
          model: m.modelName,
          ...(promptMap.get(m.modelName) ? { ...promptMap.get(m.modelName) } : {}),
        }));
      return {
        id: item.id,
        name: vendor.name,
        promptList: filteredModels,
      };
    }),
  );
  res.status(200).send(success(data));
});
