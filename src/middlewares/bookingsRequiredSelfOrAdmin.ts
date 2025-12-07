import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils/sendResponse";

/**
 * Middleware to allow:
 * @description Admin has access to any booking data, User can access their own booking data
 * @description Must be used after validatePayload(["customer_id", "vehicle_id", "rent_start_date", "rent_end_date"]),
 */

export const bookingsrequiredSelfOrAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const payload = req.validatedPayload;

  if (!req.userId || !payload || isNaN(Number(payload.customer_id))) {
    return sendResponse(res, 403, false, ["Access forbiden", "Not authorized"]);
  }

  // Allow admin to create anyone's booking
  if (req.role === "admin") return next();

  // Allow if creating own booking
  if (req.userId === Number(payload.customer_id)) return next();

  return sendResponse(res, 403, false, ["Access forbiden", "Not authorized"]);
};
