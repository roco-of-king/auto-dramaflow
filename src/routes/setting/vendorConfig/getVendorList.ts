import express from "express";
import { success } from "@/lib/responseFormat";
import u from "@/utils";
const router = express.Router();

export default router.post("/", async (req, res) => {
  const data = await u.db("o_vendorConfig").select("*");

  const list = (
    await Promise.all(
      data.map(async (item) => {
        const vendor = u.vendor.getVendor(item.id!);
        if (!vendor) {
          await u.db("o_vendorConfig").where("id", item.id).delete();
          return null
        };
        return {
          ...item,
          inputValues: JSON.parse(item.inputValues ?? "{}"),
          models: await u.vendor.getModelList(item.id!),
          code: u.vendor.getCode(item.id!),
          description: vendor.description ?? "",
          inputs: vendor.inputs,
          author: vendor.author,
          name: vendor.name,
          version: vendor.version ?? "1.0",
        };
      }),
    )
  ).filter((i) => Boolean(i));

  list.sort((a, b) => (a!.id === "toonflow" ? -1 : b!.id === "toonflow" ? 1 : 0));
  res.status(200).send(success(list));
});
