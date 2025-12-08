import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import pool from "../../config/pgDb.config";
import { updateRecordQuery } from "../../utils/updateRecordQuery";
import { checkActiveBooking } from "../../utils/checkActiveBooking";

export const updateBookingController = async (req: Request, res: Response): Promise<any> => {
  const id = req.params.bookingId;
  const payload = req.sanitizedUpdatingPayload;

  if (!id || isNaN(Number(id)) || !payload) {
    return sendResponse(res, 404, false, ["Error on cancelling/returning booking", "Invalid booking id/payload"]);
  }

  try {
    // Admin access
    if (req.role === "admin") {
      // check valid payload for admin - only customer can cancel booking
      if (payload.status === "cancelled" || payload.status === "active") {
        return sendResponse(res, 404, false, ["Error on returning booking", "Invalid booking payload"]);
      }

      // check active booking
      const hasActivebooking = await checkActiveBooking(["booking_id", id]);

      if (!hasActivebooking) {
        return sendResponse(res, 500, false, ["Error on returning booking", "Error on checking booking status"]);
      }
      if (hasActivebooking === "returned") {
        return sendResponse(res, 400, false, ["Error on returning booking", "Booking has already marked as returned"]);
      }
      if (hasActivebooking === "cancelled") {
        return sendResponse(res, 400, false, ["Error on returning booking", "Booking has already marked as cancelled"]);
      }

      // update bookings
      const updateBookingQuery = await updateRecordQuery("bookings", payload, ["id", id], "*");
      const bookingsResult = await pool.query(updateBookingQuery.query, updateBookingQuery.values);

      if (bookingsResult.rowCount === 0) {
        return sendResponse(res, 500, false, ["Error on returning booking", "Can not set the booking status"]);
      }

      const updateVehicleQuery = await updateRecordQuery(
        "vehicles",
        { availability_status: "available" } as any,
        ["id", bookingsResult.rows[0]?.vehicle_id],
        ["availability_status"]
      );

      const vehichleStatus = await pool.query(updateVehicleQuery.query, updateVehicleQuery.values);

      if (vehichleStatus.rowCount === 0) {
        return sendResponse(res, 500, false, ["Error on returning booking", "Can not set the vehicle status"]);
      }

      const data = {
        id: bookingsResult.rows[0].id,
        customer_id: bookingsResult.rows[0].customer_id,
        vehicle_id: bookingsResult.rows[0].vehicle_id,
        rent_start_date: new Date(String(bookingsResult.rows[0].rent_start_date)).toLocaleDateString("en-CA", {
          timeZone: "Asia/Dhaka",
        }),
        rent_end_date: new Date(String(bookingsResult.rows[0].rent_end_date)).toLocaleDateString("en-CA", {
          timeZone: "Asia/Dhaka",
        }),
        total_price: Number(bookingsResult.rows[0].total_price),
        status: bookingsResult.rows[0].status,
        vehicle: { ...vehichleStatus.rows[0] },
      };

      return sendResponse(res, 200, true, "Booking marked as returned. Vehicle is now available", data);
    }

    // Customer access
    if (req.role === "customer") {
      // check valid payload for customer - only admin can return booking
      if (payload.status === "returned" || payload.status === "active") {
        return sendResponse(res, 404, false, ["Error on cancelling booking", "Invalid booking payload"]);
      }

      // check active booking
      const hasActivebooking = await checkActiveBooking(["booking_id", id]);

      if (!hasActivebooking) {
        return sendResponse(res, 500, false, ["Error on cancelling booking", "Error on checking booking status"]);
      }
      if (hasActivebooking === "returned") {
        return sendResponse(res, 400, false, ["Error on cancelling booking", "Booking has already marked as returned"]);
      }
      if (hasActivebooking === "cancelled") {
        return sendResponse(res, 400, false, [
          "Error on cancelling booking",
          "Booking has already marked as cancelled",
        ]);
      }

      // update bookings
      const updateBookingQuery = await updateRecordQuery("bookings", payload, ["id", id], "*");
      const bookingsResult = await pool.query(updateBookingQuery.query, updateBookingQuery.values);

      if (bookingsResult.rowCount === 0) {
        return sendResponse(res, 500, false, ["Error on cancelling booking", "Can not set the booking status"]);
      }

      const updateVehicleQuery = await updateRecordQuery(
        "vehicles",
        { availability_status: "available" } as any,
        ["id", bookingsResult.rows[0]?.vehicle_id],
        ["availability_status"]
      );

      const vehichleStatus = await pool.query(updateVehicleQuery.query, updateVehicleQuery.values);

      if (vehichleStatus.rowCount === 0) {
        return sendResponse(res, 500, false, ["Error on cancelling booking", "Can not set the vehicle status"]);
      }

      const data = {
        id: bookingsResult.rows[0].id,
        customer_id: bookingsResult.rows[0].customer_id,
        vehicle_id: bookingsResult.rows[0].vehicle_id,
        rent_start_date: new Date(String(bookingsResult.rows[0].rent_start_date)).toLocaleDateString("en-CA", {
          timeZone: "Asia/Dhaka",
        }),
        rent_end_date: new Date(String(bookingsResult.rows[0].rent_end_date)).toLocaleDateString("en-CA", {
          timeZone: "Asia/Dhaka",
        }),
        total_price: Number(bookingsResult.rows[0].total_price),
        status: bookingsResult.rows[0].status,
      };

      return sendResponse(res, 200, true, "Booking marked as cancelled. Vehicle is now available", data);
    }

    return sendResponse(res, 500, false, ["Internal server error", "Something went wrong"]);
  } catch (error: any) {
    return sendResponse(res, 500, false, ["Internal server error", error.message]);
  }
};
