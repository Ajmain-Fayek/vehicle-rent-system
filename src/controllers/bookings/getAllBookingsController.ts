import { Request, Response } from "express";
import pool from "../../config/pgDb.config";
import { sendResponse } from "../../utils/sendResponse";

export const getAllBookingsController = async (req: Request, res: Response): Promise<any> => {
  try {
    // Admin access
    if (req.role === "admin") {
      const response = await pool.query(
        "SELECT b.id, b.customer_id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status, u.name AS customer_name, u.email AS customer_email, v.vehicle_name, v.registration_number FROM bookings b JOIN users u ON b.customer_id = u.id JOIN vehicles v ON b.vehicle_id = v.id ORDER BY b.id DESC"
      );

      const data = response.rows.map((r) => ({
        id: r.id,
        customer_id: r.customer_id,
        vehicle_id: r.vehicle_id,
        rent_start_date: new Date(String(r.rent_start_date)).toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" }),
        rent_end_date: new Date(String(r.rent_end_date)).toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" }),
        total_price: Number(r.total_price),
        status: r.status,
        customer: {
          name: r.customer_name,
          email: r.customer_email,
        },
        vehicle: {
          vehicle_name: r.vehicle_name,
          registration_number: r.registration_number,
        },
      }));

      return sendResponse(res, 200, true, "Bookings retrieved successfully", data);
    }

    // Customer access
    if (req.role === "customer") {
      const response = await pool.query(
        "SELECT b.id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status, v.vehicle_name, v.registration_number, v.type FROM bookings b JOIN vehicles v ON b.vehicle_id = v.id WHERE b.customer_id = $1 ORDER BY b.id DESC",
        [req.userId]
      );

      const data = response.rows.map((r) => ({
        id: r.id,
        customer_id: r.customer_id,
        vehicle_id: r.vehicle_id,
        rent_start_date: new Date(String(r.rent_start_date)).toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" }),
        rent_end_date: new Date(String(r.rent_end_date)).toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" }),
        total_price: Number(r.total_price),
        status: r.status,
        vehicle: {
          vehicle_name: r.vehicle_name,
          registration_number: r.registration_number,
          type: r.type,
        },
      }));

      return sendResponse(res, 200, true, "Bookings retrieved successfully", data);
    }

    return sendResponse(res, 500, false, ["Internal server error", "Something went wrong"]);
  } catch (error: any) {
    return sendResponse(res, 500, false, ["Internal server error", error.message]);
  }
};
