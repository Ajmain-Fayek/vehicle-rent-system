import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import pool from "../../config/pgDb.config";
import bcrypt from "bcrypt";
import { generateJwtToken } from "../../utils/generateJwtToken";

export const signinController = async (req: Request, res: Response): Promise<any> => {
  if (!req.validatedPayload) {
    return sendResponse(res, 400, false, "Payload missing");
  }

  const { email, password } = req.validatedPayload!;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1 LIMIT 1", [email]);

    if (user.rows.length === 0) {
      return sendResponse(res, 404, true, "User not found.");
    }

    const { password: hashedPassword, ...userData } = user.rows[0];

    const isPasswordMatched = await bcrypt.compare(password as string, hashedPassword);

    if (!isPasswordMatched) {
      return sendResponse(res, 401, true, "Unauthorized");
    }

    const token = generateJwtToken(userData);

    return sendResponse(res, 200, true, "Login successful", { token: token, user: { ...userData } });
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
};
