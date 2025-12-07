import { Response, Request, NextFunction } from "express";
import { sendResponse } from "../utils/sendResponse";

/**
 * middleware to validate incomming requst body payload
 * @param requiredFields Array of fields
 * @returns injects sanitized data object into request header as sanitizedUpdatingPayload
 */

export const validateUpdatingPayload = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const sanitizedFields: string[] = [];
    const sanitizedValues: string[] = [];

    for (const field of requiredFields) {
      const value = req.body?.[field];
      if (value === undefined || value === null || !String(value).trim()) {
        continue;
      }

      sanitizedFields.push(String(field));
      sanitizedValues.push(String(value));
    }

    if (sanitizedFields.length === 0 || sanitizedValues.length === 0) {
      return sendResponse(res, 400, false, ["Error sanitizing update fields", "No update information are provided"]);
    }

    req.sanitizedUpdatingPayload = sanitizedFields.reduce((acc, field) => {
      acc[field] = req.body[field];

      return acc;
    }, {} as Record<string, string>);

    next();
  };
};
