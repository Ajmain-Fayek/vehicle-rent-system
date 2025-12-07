import { Request, Response } from "express";
import pool from "../../config/pgDb.config";
import { sendResponse } from "../../utils/sendResponse";
import { updateRecordQuery } from "../../utils/updateRecordQuery";

export const updateUserController = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params?.userId;

    if (!id || isNaN(Number(id))) {
      return sendResponse(res, 400, false, ["Erron on updating user", "Invalid user id"]);
    }

    // Check vehicle existance
    const userExists = await pool.query("SELECT id FROM users WHERE id = $1 LIMIT 1", [Number(id)]);

    if (userExists.rowCount === 0) {
      return sendResponse(res, 404, false, ["Erron on updaing user", "User not found"]);
    }

    // Procced to update
    const result = await updateRecordQuery(
      "users",
      req.sanitizedUpdatingPayload,
      ["id", id as string],
      ["id", "name", "email", "phone", "role"]
    );

    const response = await pool.query(result.query, result.values);

    return sendResponse(res, 200, true, "User updated successfully", response.rows[0]);
  } catch (error: any) {
    return sendResponse(res, 500, false, ["Internal server error", error.message]);
  }
};
