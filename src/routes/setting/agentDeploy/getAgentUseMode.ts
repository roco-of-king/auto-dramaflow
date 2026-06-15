import express from "express";
import { success, error } from "@/lib/responseFormat";
import u from "@/utils";

const router = express.Router();

export default router.get("/", async (req, res) => {
  const useMode = await u.db("o_setting").where("key", "agentUseMode").first();
  console.log("%c Line:9 🍓 useMode", "background:#33a5ff", useMode);
  res.status(200).send(success(useMode?.value || "0"));
});
