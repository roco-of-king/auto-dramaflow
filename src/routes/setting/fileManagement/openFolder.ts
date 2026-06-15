import express from "express";
import { z } from "zod";
import { exec } from "child_process";
import { success, error } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
import { isEletron } from "@/utils/getPath";
import u from "@/utils";
import path from "path";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    path: z.string(),
  }),
  async (req, res) => {
    if (!isEletron()) {
      return res.status(400).send(error("仅支持客户端打开文件夹"));
    }
    const { path: folderPath } = req.body;
    const platform = process.platform;
    const target = u.getPath(folderPath);
    const cmd = platform === "win32" ? `explorer "${target}"` : platform === "darwin" ? `open "${target}"` : `xdg-open "${target}"`;
    exec(cmd, (err) => {
      if (err) {
        return res.status(200).send(error(err.message));
      }
      res.status(200).send(success("打开文件夹成功"));
    });
  },
);
