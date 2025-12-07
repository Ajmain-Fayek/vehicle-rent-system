import { Request, Response } from "express";
import pool from "../../config/pgDb.config";
import { sendResponse } from "../../utils/sendResponse";

export const getAllUsersController = async (req: Request, res: Response): Promise<any> => {
  try {
    const response = await pool.query("SELECT id, name, email, phone, role FROM users");

    return sendResponse(res, 200, true, "Users retrieved successfully", response.rows);
  } catch (error: any) {
    return sendResponse(res, 500, false, ["Internal server error", error.message]);
  }
};
