import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils/sendResponse";

/**
 * Middleware to allow:
 * @description Admin has access to anyone's data, User can access their own data
 *
 */

export const requiredSelfOrAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const targetUserId = Number(req.params.userId);

  if (!req.userId || isNaN(targetUserId)) {
    return sendResponse(res, 403, false, ["Access forbiden", "Not authorized"]);
  }

  // Allow admin to access anyone's data
  if (req.role === "admin") return next();

  // Allow if accessing own data
  if (req.userId === targetUserId) return next();

  return sendResponse(res, 403, false, ["Access forbiden", "Not authorized"]);
};
