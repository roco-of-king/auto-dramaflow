import express from "express";
import u from "@/utils";
import { db } from "@/utils/db";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    projectId: z.number(),
    page: z.number(),
    limit: z.number(),
    search: z.string().optional(),
  }),
  async (req, res) => {
    const { projectId, page, limit, search } = req.body;
    const offset = (page - 1) * limit;

    // 构造基础查询：通过 o_eventChapter -> o_novel 过滤 projectId，再 join o_event 取名称和内容
    const baseQuery = u
      .db("o_event as e")
      .join("o_eventChapter as ec", "ec.eventId", "e.id")
      .join("o_novel as n", "n.id", "ec.novelId")
      .where("n.projectId", projectId);

    if (search) {
      baseQuery.where("e.name", "like", `%${search}%`);
    }

    // 统计去重后的事件总数
    const [{ total }] = await baseQuery.clone().countDistinct("e.id as total");

    if (!Number(total)) {
      return res.status(200).send(success({ list: [], total: 0 }));
    }

    // 分页查询：每个事件对应多个 chapterIndex，用 GROUP_CONCAT 聚合
    const rows = await baseQuery
      .clone()
      .select("e.id", "e.name as eventName", "e.detail", "e.createTime", db.raw("GROUP_CONCAT(n.chapterIndex) as chapterIndexes"))
      .groupBy("e.id")
      .limit(limit)
      .offset(offset);

    const list = rows.map((e: { id: number; eventName: string; detail: string; createTime: number; chapterIndexes: string | null }) => ({
      id: e.id,
      eventName: e.eventName,
      detail: e.detail,
      createTime: e.createTime,
      chapters: e.chapterIndexes ? e.chapterIndexes.split(",").map(Number) : [],
    }));

    res.status(200).send(success({ list, total: Number(total) }));
  },
);
