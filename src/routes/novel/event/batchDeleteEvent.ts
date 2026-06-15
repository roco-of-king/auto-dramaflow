import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    ids: z.array(z.number()),
  }),
  async (req, res) => {
    const { ids } = req.body;

    await u.db("o_event").whereIn("id", ids).del();
    await u.db("o_eventChapter").whereIn("eventId", ids).del();

    res.status(200).send(success({ message: "删除事件成功" }));
  },
);
