import { Response, Request, NextFunction } from "express";
import { sendResponse } from "../utils/sendResponse";

export const validatePayload = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const field of requiredFields) {
      const value = req.body?.[field];
      if (!value || !String(value).trim()) {
        return sendResponse(res, 400, false, ["Missing Field", `'${field}' required!`]);
      }
    }

    req.validatedPayload = requiredFields.reduce((acc, field) => {
      acc[field] = req.body[field];

      return acc;
    }, {} as Record<string, string>);

    next();
  };
};
