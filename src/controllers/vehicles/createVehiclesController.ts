import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import pool from "../../config/pgDb.config";

export const createVehiclesController = async (req: Request, res: Response): Promise<any> => {
  if (!req.validatedPayload) {
    return sendResponse(res, 400, false, "Missing payload");
  }

  try {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.validatedPayload!;

    const existingVehicle = await pool.query("SELECT id FROM vehicles WHERE registration_number = $1", [
      registration_number,
    ]);

    if (existingVehicle.rows.length !== 0) {
      return sendResponse(res, 400, false, "Vehicle already exists");
    }

    const response = await pool.query(
      "INSERT INTO vehicles ( vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ( $1, $2, $3, $4, $5) RETURNING *",
      [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    );

    return sendResponse(res, 201, true, "Vehicle created successfully", response.rows[0]);
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
};
