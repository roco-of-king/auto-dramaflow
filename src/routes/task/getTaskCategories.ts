import express from "express";
import u from "@/utils";
import { success } from "@/lib/responseFormat";
const router = express.Router();

export default router.post("/", async (req, res) => {
  const list = await u.db("o_tasks").select("taskClass").groupBy("taskClass");
  const data = list.filter((item) => item.taskClass);
  res.status(200).send(success(data));
});
