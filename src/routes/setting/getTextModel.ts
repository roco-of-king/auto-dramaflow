import express from "express";
import { success } from "@/lib/responseFormat";
const router = express.Router();

export default router.post(
    "/",
    async (req, res) => {
        res.status(200).send(success("123"));
    },
);
