import express from "express";
import { error, success } from "@/lib/responseFormat";
import u from "@/utils";
import { z } from "zod";
import { validateFields } from "@/middleware/middleware";
import fs from "fs/promises";
import path from "path";

const router = express.Router();

export default router.post(
  "/",
  validateFields({
    path: z.string(),
  }),
  async (req, res) => {
    const { path: filePath } = req.body;

    const modelPromptRoot = u.getPath(["modelPrompt"]);

    // 路径隧穿检测
    const resolvedRoot = path.resolve(modelPromptRoot);
    const resolvedFile = path.resolve(modelPromptRoot, filePath);
    if (!resolvedFile.startsWith(resolvedRoot + path.sep)) {
      return res.status(400).send(error("非法路径"));
    }

    // 文件不存在则报错
    try {
      await fs.access(resolvedFile);
    } catch {
      return res.status(404).send(error("文件不存在"));
    }

    await fs.unlink(resolvedFile);
    res.status(200).send(success("删除成功"));
  },
);
