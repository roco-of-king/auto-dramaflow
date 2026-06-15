import { Request, Response, NextFunction } from "express";
import { z, ZodTypeAny } from "zod";

import { zhCN } from "zod/locales";

z.config(zhCN());

export function validateFields(
  shape: Record<string, ZodTypeAny>,
  source: "body" | "query" | "params" = "body", // 默认校验 body
) {
  const schema = z.object(shape);

  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[source];
    const parseResult = schema.safeParse(data);
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((issue) => `字段 ${issue.path.join(".")} ${issue.message}`);
      console.error(errors);
      return res.status(400).json({ message: "参数错误", errors });
    }
    next();
  };
}
