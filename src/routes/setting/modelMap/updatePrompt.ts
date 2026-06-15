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
    name: z.string().min(1),
    data: z.string(),
    type: z.enum(["image", "video"]),
  }),
  async (req, res) => {
    const { name, data, type } = req.body;

    const modelPromptRoot = u.getPath(["modelPrompt"]);
    const filePath = path.join(modelPromptRoot, type, `${name}.md`);

    // 路径隧穿检测
    const resolvedRoot = path.resolve(modelPromptRoot);
    const resolvedFile = path.resolve(filePath);
    if (!resolvedFile.startsWith(resolvedRoot + path.sep)) {
      return res.status(400).send(error("非法路径"));
    }

    // 文件不存在则报错
    try {
      await fs.access(resolvedFile);
    } catch {
      return res.status(404).send(error("文件不存在"));
    }

    await fs.writeFile(resolvedFile, data, "utf-8");
    res.status(200).send(success("更新成功"));
  },
);
