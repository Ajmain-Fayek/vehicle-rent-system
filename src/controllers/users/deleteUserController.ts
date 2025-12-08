import { Request, Response } from "express";
import pool from "../../config/pgDb.config";
import { sendResponse } from "../../utils/sendResponse";
import { deleteRecordQuery } from "../../utils/deleteRecordQuery";
import { checkActiveBooking } from "../../utils/checkActiveBooking";

export const deleteUserController = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params?.userId;

    if (!id || isNaN(Number(id))) {
      return sendResponse(res, 400, false, ["Erron on deleting user", "Invalid user id"]);
    }

    // Check user existance
    const userExists = await pool.query("SELECT id FROM users WHERE id = $1 LIMIT 1", [Number(id)]);

    if (userExists.rowCount === 0) {
      return sendResponse(res, 404, false, ["Erron on deleting user", "User not found"]);
    }

    // Check active bookings
    const hasActiveBookings = await checkActiveBooking(["customer_id", id]);

    if (hasActiveBookings) {
      return sendResponse(res, 400, false, ["Error deleting user", "User has active booking"]);
    }

    // Proceed to delete
    const result = await deleteRecordQuery("users", ["id", id]);

    const response = await pool.query(result.query, result.values);

    if (response.rowCount === 0) {
      return sendResponse(res, 500, false, ["Internal server error", "something went wrong"]);
    }

    return sendResponse(res, 200, true, "User deleted successfully");
  } catch (error: any) {
    return sendResponse(res, 500, false, ["Internal server error", error.message]);
  }
};
