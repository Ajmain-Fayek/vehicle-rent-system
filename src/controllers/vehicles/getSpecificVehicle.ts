import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import pool from "../../config/pgDb.config";

export const getSpecificVehicles = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params?.vehicleId;

    if (!id || isNaN(Number(id))) {
      return sendResponse(res, 400, false, ["Erron on fatching vehicle", "Invalid vehicle id"]);
    }

    const response = await pool.query("SELECT * FROM vehicles WHERE id = $1 LIMIT 1", [Number(id)]);

    if (response.rowCount === 0) {
      return sendResponse(res, 404, false, ["Erron on fatching vehicle", "Vehicle not found"]);
    }

    return sendResponse(res, 200, true, "Vehicles retrieved successfully", response.rows[0]);
  } catch (error: any) {
    return sendResponse(res, 500, false, ["Internal server error", error.message]);
  }
};
