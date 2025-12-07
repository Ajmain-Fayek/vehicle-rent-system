import { Response, Request, NextFunction } from "express";
import { sendResponse } from "../utils/sendResponse";

/**
 * Middleware to validate payload
 * @description all the fields must have to be present in the request body, if not response send as missing field
 * @param requiredFields Array of fields to validate against incoming request body
 * @returns injects validated payload object into request header as validatedPayload
 */

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
