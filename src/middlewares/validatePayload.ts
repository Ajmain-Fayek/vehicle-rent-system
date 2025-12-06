import { Response, Request, NextFunction } from "express";
import { TApiResponse } from "../types/index";

export const validatePayload = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const field of requiredFields) {
      const value = req.body?.[field];
      if (!value || !String(value).trim()) {
        return res.status(400).json({
          success: false,
          message: `'${field}' is missing!`,
        } as TApiResponse);
      }
    }

    req.validatedPayload = requiredFields.reduce((acc, field) => {
      acc[field] = req.body[field];

      return acc;
    }, {} as Record<string, string>);

    next();
  };
};