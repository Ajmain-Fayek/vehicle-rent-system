import { Request, Response } from "express";
import pool from "../../config/pgDb.config";
import { sendResponse } from "../../utils/sendResponse";
import { deleteRecordQuery } from "../../utils/deleteRecordQuery";
import { checkActiveBooking } from "../../utils/checkActiveBooking";

export const deleteVehiclesController = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params?.vehicleId;

    if (!id || isNaN(Number(id))) {
      return sendResponse(res, 400, false, ["Erron on deleting vehicle", "Invalid vehicle id"]);
    }

    // Check vehicle existance
    const vehicleExists = await pool.query("SELECT id FROM vehicles WHERE id = $1 LIMIT 1", [Number(id)]);

    if (vehicleExists.rowCount === 0) {
      return sendResponse(res, 404, false, ["Erron on deleting vehicle", "Vehicle not found"]);
    }

    // Check active bookings
    const hasActiveBookings = await checkActiveBooking(["vehicle_id", id]);

    if (hasActiveBookings) {
      return sendResponse(res, 400, false, ["Error deleting vehicle", "Vehicle has active booking"]);
    }

    // Proceed to delete
    const result = await deleteRecordQuery("vehicles", ["id", id]);

    const response = await pool.query(result.query, result.values);

    if (response.rowCount === 0) {
      return sendResponse(res, 500, false, ["Internal server error", "something went wrong"]);
    }

    return sendResponse(res, 200, true, "Vehicle deleted successfully");
  } catch (error: any) {
    return sendResponse(res, 500, false, ["Internal server error", error.message]);
  }
};
