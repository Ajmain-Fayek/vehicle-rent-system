import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import pool from "../../config/pgDb.config";
import { updateRecordQuery } from "../../utils/updateRecordQuery";

export const updateVehiclesController = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params?.vehicleId;

    if (!id || isNaN(Number(id))) {
      return sendResponse(res, 400, false, ["Erron on updating vehicle", "Invalid vehicle id"]);
    }

    // Check vehicle existance
    const vehicleExists = await pool.query("SELECT id FROM vehicles WHERE id = $1 LIMIT 1", [Number(id)]);

    if (vehicleExists.rowCount === 0) {
      return sendResponse(res, 404, false, ["Erron on updaing vehicle", "Vehicle not found"]);
    }

    // Procced to update
    const result = await updateRecordQuery("vehicles", req.sanitizedUpdatingPayload, ["id", id as string], "*");

    const response = await pool.query(result.query, result.values);

    return sendResponse(res, 200, true, "Vehicle updated successfully", response.rows[0]);
  } catch (error: any) {
    return sendResponse(res, 500, false, ["Internal server error", error.message]);
  }
};
