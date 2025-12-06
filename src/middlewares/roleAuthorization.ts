import { Request, Response, NextFunction } from "express";
import { Role, roleHierarchy } from "../types";
import { sendResponse } from "../utils/sendResponse";

export const roleAuthorization = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req?.role) {
      return sendResponse(res, 401, false, "Access forbiden");
    }

    if (allowedRoles.includes(req.role as Role)) {
      return next();
    }

    const inheritedRoles = roleHierarchy[req.role as Role] || [];

    if (inheritedRoles.some((role) => allowedRoles.includes(role))) {
      return next();
    }

    return sendResponse(res, 401, false, "Access forbiden");
  };
};
