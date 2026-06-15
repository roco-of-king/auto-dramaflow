import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import compressing from "compressing";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    id: z.array(z.number()),
  }),
  async (req, res) => {
    const { id } = req.body;
    const scripts = await u.db("o_script").whereIn("id", id);
    const textList = scripts.map((s) => ({ name: s.name, text: s.content }));
    //压缩为zip文件
    const zipStream = new compressing.zip.Stream();
    textList.forEach((item) => {
      zipStream.addEntry(Buffer.from(item.text!), { relativePath: `${item.name}.txt` });
    });
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename=scripts.zip`);
    zipStream.pipe(res);
  },
);
