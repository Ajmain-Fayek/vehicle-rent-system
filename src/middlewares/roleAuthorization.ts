import { Request, Response, NextFunction } from "express";
import { Role, roleHierarchy } from "../types";
import { sendResponse } from "../utils/sendResponse";

/**
 * Middleware to check role access,
 * @description Must be used after validateJwtToken middleware
 * @param allowedRoles - Array of roles
 * @returns next() | a response with code 403
 */

export const roleAuthorization = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req?.role) {
      return sendResponse(res, 403, false, ["Access forbiden", "role not found"]);
    }

    if (allowedRoles.includes(req.role as Role)) {
      return next();
    }

    const inheritedRoles = roleHierarchy[req.role as Role] || [];

    if (inheritedRoles.some((role) => allowedRoles.includes(role))) {
      return next();
    }

    return sendResponse(res, 403, false, ["Access forbiden", "Unauthorized role"]);
  };
};
