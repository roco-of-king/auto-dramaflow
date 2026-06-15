import express from "express";
import { success, error } from "@/lib/responseFormat";
import { db } from "@/utils/db";

const router = express.Router();

export default router.get("/", async (req, res) => {
  try {
    const tables: { name: string }[] = await db.raw(
      `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'knex_%'`,
    );

    const tableInfo = [];
    for (const table of tables) {
      const countResult = await db.raw(`SELECT COUNT(*) as count FROM "${table.name}"`);
      tableInfo.push({
        name: table.name,
        rowCount: countResult[0]?.count ?? 0,
      });
    }

    res.status(200).send(success(tableInfo));
  } catch (err: any) {
    res.status(500).send(error(err?.message || "获取数据库信息失败"));
  }
});
