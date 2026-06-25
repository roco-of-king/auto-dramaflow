import express from "express";
import { success } from "@/lib/responseFormat";
import u from "@/utils";

const router = express.Router();

export default router.get("/", async (req, res) => {
  const skipUpdateCheck = await u.db("o_setting").where("key", "skipUpdateCheck").first();
  res.status(200).send(success(skipUpdateCheck?.value || "0"));
});
