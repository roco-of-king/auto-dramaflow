import express from "express";
import u from "@/utils";
import fs from "node:fs/promises";
import { z } from "zod";
import { error, success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

// 删除导演手册
export default router.post(
  "/",
  validateFields({
    name: z.string(),
  }),
  async (req, res) => {
    try {
      const { name } = req.body as { name: string };

      // 安全校验：不允许包含路径分隔符、纯数字，防止越级删除或误删项目目录
      if (name.includes("/") || name.includes("\\") || name === "." || name === ".." || /^\d+$/.test(name)) {
        res.status(400).send(error("名称不能包含路径分隔符或为纯数字"));
        return;
      }

      const artPromptsDir = u.getPath(["skills", "story_skills", name]);

      try {
        const stat = await fs.stat(artPromptsDir);
        if (!stat.isDirectory()) {
          throw new Error(`${artPromptsDir} 不是文件夹`);
        }
        await fs.rm(artPromptsDir, { recursive: true, force: true });
      } catch (e) {
        console.error("[删除视觉手册] 删除失败:", artPromptsDir, e);
      }
      res.status(200).send(success({ message: "删除成功" }));
    } catch (err) {
      res.status(500).send(error(u.error(err).message || "删除失败"));
    }
  },
);
