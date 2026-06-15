import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();
export default router.post(
    "/",
    validateFields({
        id: z.number(),
        duration: z.number().optional(),
    }),
    async (req, res) => {
        const { id, duration } = req.body;
        await u.db("o_videoTrack").where("id", id).update({
            duration,
        });
        res.status(200).send(success("更新成功"));
    },
);
