import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    content: z.string(),
  }),
  async (req, res) => {
    const { content } = req.body;
    const systemPrompt = `你是一个正则表达式专家。用户会提供一段剧本文本，你需要分析其中的集/章节分隔模式，返回一个JavaScript正则表达式字符串。

要求：
1. 正则必须包含两个捕获组：第一个捕获组匹配集数/章节编号（数字或中文数字），第二个捕获组匹配该集的标题/名称（scriptName）。
2. 返回格式为 /正则表达式/g，例如：/第\s*([0-9一二三四五六七八九十百千万]+)\s*集\s*([^\n\r]*)/g
3. 只返回正则表达式字符串本身，不要有任何其他解释文字或markdown格式。
4. 如果文本中没有明显的章节分隔模式，返回空字符串。`;

    const resText = await u.Ai.Text("universalAi").invoke({
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: content.slice(0, 2000),
        },
      ],
    });
    const result = (resText.text || "").trim();
    res.status(200).send(success(result));
  },
);
