import { Response, Request, NextFunction } from "express";
import { sendResponse } from "../utils/sendResponse";

/**
 * middleware to validate incomming requst body payload
 * @param allowFields Array of fields
 * @returns injects sanitized data object into request header as sanitizedUpdatingPayload
 */

export const validateUpdatingPayload = (allowFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let sanitizedFields: string[] = [];

    for (const field of allowFields) {
      if (req.role === "customer" && field === "role") {
        continue;
      }

      const value = req.body?.[field];

      if (value === undefined || value === null || String(value).trim() === "") {
        continue;
      }

      sanitizedFields.push(String(field));
    }

    if (sanitizedFields.length === 0) {
      return sendResponse(res, 400, false, ["Error sanitizing update fields", "No update information are provided"]);
    }

    req.sanitizedUpdatingPayload = sanitizedFields.reduce((acc, field) => {
      acc[field] = req.body[field];

      return acc;
    }, {} as Record<string, string>);

    next();
  };
};
