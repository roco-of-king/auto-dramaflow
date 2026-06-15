import express from "express";
const router = express.Router();
import u from "@/utils";
import fs from 'fs';

export default router.get("/", async (req, res) => {
  return res.send("ok");
  const test = await u.db("o_vendorConfig").select("*");
  fs.writeFileSync("test.json", JSON.stringify(test, null, 2));

  res.send(test);
});
