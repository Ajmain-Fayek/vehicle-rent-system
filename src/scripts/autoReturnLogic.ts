import cron from "node-cron";
import pool from "../config/pgDb.config";

cron.schedule(
  "0 0 * * *",
  async () => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      await client.query(
        "UPDATE bookings SET status = 'returned' WHERE status = 'active' AND rent_end_date < CURRENT_DATE"
      );

      await client.query(
        "UPDATE vehicles SET availability_status = 'available' WHERE id IN ( SELECT vehicle_id FROM bookings WHERE status = 'returned' AND rent_end_date < CURRENT_DATE )"
      );

      await client.query("COMMIT");
      console.log(`[INFO] [${new Date().toISOString()}] Auto-return job executed successfully`);
    } catch (error: any) {
      await client.query("ROLLBACK");
      console.error(`[ERROR] [${new Date().toISOString()}] Error on auto-return job:`, error.message);
    } finally {
      client.release();
    }
  },
  { timezone: "Asia/Dhaka" }
);
