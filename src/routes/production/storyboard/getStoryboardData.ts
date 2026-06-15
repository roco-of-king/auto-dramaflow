import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    scriptId: z.number(),
    page: z.number(),
    limit: z.number(),
    name: z.string().optional().nullable(),
  }),
  async (req, res) => {
    const { scriptId, page, limit, name } = req.body;
    const offset = (page - 1) * limit;

    const storyboardData = await u
      .db("o_storyboard")
      .where({ scriptId })
      .modify((qb) => {
        if (name) {
          qb.andWhere("title", "like", `%${name}%`);
        }
      })
      .offset(offset)
      .limit(limit);
    const data = await Promise.all(
      storyboardData.map(async (i: any) => {
        return {
          id: i.id,
          prompt: i.prompt,
          state: i.state,
          src: i.filePath ? await u.oss.getSmallImageUrl(i.filePath!) : "",
        };
      }),
    );
    const totalQuery = (await u
      .db("o_storyboard")
      .where({ scriptId })
      .modify((qb) => {
        if (name) {
          qb.andWhere("title", "like", `%${name}%`);
        }
      })
      .count("* as total")
      .first()) as any;

    res.status(200).send(success({ data: data, total: totalQuery?.total }));
  },
);
