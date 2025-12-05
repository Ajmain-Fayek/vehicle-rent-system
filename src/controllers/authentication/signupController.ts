import { Request, Response } from "express";
import pool from "../../config/pgDb.config";
import bcrypt from "bcrypt";
import envConfig from "../../config/env.config";
import { sendResponse } from "../../utils/sendResponse";

export const signupController = async (req: Request, res: Response): Promise<any> => {
  if (!req.validatedPayload) {
    return sendResponse(res, 400, false, "Payload missing");
  }

  const { name, email, password, phone, role } = req.validatedPayload!;

  try {
    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

    if (existingUser.rows.length !== 0) {
      return sendResponse(res, 400, false, "User already exists.");
    }

    const hashedPassword = await bcrypt.hash(password as string, envConfig.saltRounds);

    const response = await pool.query(
      "INSERT INTO users (name, email, password, phone, role) VALUES ( $1, $2, $3, $4, $5 ) RETURNING id, name, email, phone, role",
      [name, email, hashedPassword, phone, role]
    );

    return sendResponse(res, 201, true, "User registered successfully", response.rows[0]);
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
};
