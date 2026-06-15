import express from "express";
import u from "@/utils";
import { success, error } from "@/lib/responseFormat";

const router = express.Router();

export default router.post("/", async (req, res) => {
  const list = await u.db("o_prompt").select("*");
  const data = await Promise.all(
    list.map(async (item) => {
      return {
        ...item,
        data: item.useData ? item.useData : item.data,
      };
    }),
  );
  res.status(200).send(success(data));
});
