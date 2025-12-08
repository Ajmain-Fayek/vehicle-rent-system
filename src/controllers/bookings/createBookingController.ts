import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import pool from "../../config/pgDb.config";
import { checkActiveBooking } from "../../utils/checkActiveBooking";
import { updateRecordQuery } from "../../utils/updateRecordQuery";

export const createBookingController = async (req: Request, res: Response): Promise<any> => {
  if (!req.validatedPayload) {
    return sendResponse(res, 400, false, ["Error creating booking", "Missing payload"]);
  }

  try {
    const payload = req.validatedPayload;

    // Check existing vehicle
    const vehicleExists = await pool.query("SELECT id FROM vehicles WHERE id = $1 LIMIT 1", [
      Number(payload.vehicle_id),
    ]);

    if (vehicleExists.rowCount === 0) {
      return sendResponse(res, 404, false, ["Error on booking vehicle", "Vehicle not found"]);
    }

    // Check active booking
    const hasActiveBooking = await checkActiveBooking(["vehicle_id", String(payload.vehicle_id)]);

    if (hasActiveBooking) {
      return sendResponse(res, 400, false, ["Error on booking vehicle", "vehicle already booked"]);
    }

    // Calculate price
    const rentPrice = await pool.query("SELECT daily_rent_price, vehicle_name FROM vehicles WHERE id = $1", [
      payload.vehicle_id,
    ]);

    const startDate = new Date(String(payload.rent_start_date));
    const endDate = new Date(String(payload.rent_end_date));

    const diffMs = endDate.getTime() - startDate.getTime(); // differece in mili-second
    const diffDays = diffMs / (1000 * 60 * 60 * 24); // difference in days

    const totalPrice = Number(rentPrice.rows[0].daily_rent_price) * diffDays;

    const response = await pool.query(
      "INSERT INTO bookings ( customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status ) VALUES ( $1, $2, $3, $4, $5, $6 ) RETURNING * ",
      [payload.customer_id, payload.vehicle_id, payload.rent_start_date, payload.rent_end_date, totalPrice, "active"]
    );

    if (response.rowCount === 0) {
      return sendResponse(res, 500, false, ["Error on booking vehicle", "Can not create booking"]);
    }

    const vehicleUpdateQuery = await updateRecordQuery(
      "vehicles",
      {
        availability_status: "booked",
      },
      ["id", response.rows[0].vehicle_id],
      ["availability_status"]
    );

    const changeVehichleStatus = await pool.query(vehicleUpdateQuery.query, vehicleUpdateQuery.values);

    if (changeVehichleStatus.rowCount === 0) {
      return sendResponse(res, 500, false, ["Error on booking vehicle", "Can not set the vehicle availability status"]);
    }

    const data = {
      ...response.rows[0],
      total_price: Number(response.rows[0].total_price),
      rent_start_date: new Date(response.rows[0].rent_start_date).toLocaleDateString("en-CA", {
        timeZone: "Asia/Dhaka",
      }),
      rent_end_date: new Date(response.rows[0].rent_end_date).toLocaleDateString("en-CA", {
        timeZone: "Asia/Dhaka",
      }),
      vehicle: {
        vehicle_name: rentPrice.rows[0].vehicle_name,
        daily_rent_price: Number(rentPrice.rows[0].daily_rent_price),
      },
    };

    return sendResponse(res, 201, true, "Booking created successfully", data);
  } catch (error: any) {
    return sendResponse(res, 500, false, ["Internal server error", error.message]);
  }
};
