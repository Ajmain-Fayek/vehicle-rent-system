import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import pool from "../../config/pgDb.config";

export const getAllVehiclesController = async (req: Request, res: Response): Promise<any> => {
  try {
    const response = await pool.query("SELECT * FROM vehicles");

    return sendResponse(res, 200, true, "Vehicles retrieved successfully", response.rows);
  } catch (error: any) {
    return sendResponse(res, 500, false, ["Internal server error", error.message]);
  }
};
