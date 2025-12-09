import pool from "../config/pgDb.config";
import { TdeleteColumn } from "../types";

/**
 * To check if the condition has active booking
 * @param condition where clause tuple [ "customer_id" | "vehicle_id" | "booking_id", 1 ]
 * @example ["vehicle_id", 1] , ["customer_id", 1], ["booking_id", 1]
 * @returns boolean | string
 */
export const checkActiveBooking = async (
  condition: [field: TdeleteColumn, value: string]
): Promise<boolean | string> => {
  try {
    if (condition[0] === "booking_id") {
      const result = await pool.query(`SELECT status FROM bookings WHERE id = $1`, [condition[1]]);

      if (result.rowCount === 0) {
        return false;
      }

      return result.rows[0].status;
    }

    const result = await pool.query(`SELECT id FROM bookings WHERE status = 'active' AND ${condition[0]} = $1`, [
      condition[1],
    ]);

    if (result.rowCount === 0) {
      return false;
    }

    return true;
  } catch (error: any) {
    console.log(error.message);

    return false;
  }
};
