import express from "express";
import { success } from "@/lib/responseFormat";
import { getVersion } from "@/utils/writeVersion";

const router = express.Router();

export default router.get("/", async (req, res) => {
  const version = await getVersion();
  res.status(200).send(success(version));
});
