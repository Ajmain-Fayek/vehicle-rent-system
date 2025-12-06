import { Response, Request, NextFunction } from "express";
import { sendResponse } from "../utils/sendResponse";
import jwt from "jsonwebtoken";
import envConfig from "../config/env.config";
import pool from "../config/pgDb.config";

export const validateJwtToken = async (req: Request, res: Response, next: NextFunction) => {
  const tokenWihPrefix = req.headers["authorization"];

  if (!tokenWihPrefix) {
    return sendResponse(res, 401, false, "Unauthorized! Missing token");
  }

  const [prefix, token] = tokenWihPrefix.split(" ");

  if (prefix !== "Bearer" || !token?.trim()) {
    return sendResponse(res, 401, false, "Unauthorized! Invalid token");
  }

  try {
    const decode: any = jwt.verify(token, envConfig.jwtPublicSecret);

    const user = await pool.query("SELECT email FROM users WHERE id = $1 LIMIT 1", [decode.id]);

    if (user.rows[0]?.email !== decode.email) {
      return sendResponse(res, 401, false, "Unauthorized");
    }

    req.role = decode.role;
    req.userId = decode.id;

    next();
  } catch (error: any) {
    return sendResponse(res, 401, false, `Unauthorized! ${error.message}`);
  }
};
