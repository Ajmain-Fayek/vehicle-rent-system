import pg from "pg";
import envConfig from "./env.config";
import { checkExistingTable } from "../utils/checkExistingTable";
import { checkExistingEnum } from "../utils/checkExistingEnum";

const { Pool } = pg;

const pool = new Pool({ connectionString: envConfig.pgDb });

export default pool;

// Check Database connection & initialize tables if not exists
export async function checkDatabaseConnection() {
  try {
    // User table initialization
    const isUsersTableExists = await checkExistingTable("users");

    if (!isUsersTableExists) {
      const isUserRoleEnumExists = await checkExistingEnum("user_role");

      if (!isUserRoleEnumExists) {
        await pool.query("CREATE TYPE user_role AS ENUM ('admin', 'customer');");
      }

      await pool.query(
        "CREATE TABLE users ( id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, phone TEXT NOT NULL, role user_role DEFAULT 'customer'); "
      );
    }

    // Vehicles table initialization
    const isVehiclesTableExists = await checkExistingTable("vehicles");

    if (!isVehiclesTableExists) {
      const isVehicleTypeEnumExists = await checkExistingEnum("vehicle_type");
      const isAvailabilityStatusEnumExists = await checkExistingEnum("availability_status");

      if (!isVehicleTypeEnumExists) {
        await pool.query("CREATE TYPE vehicle_type AS ENUM ('car', 'bike', 'van', 'SUV');");
      }

      if (!isAvailabilityStatusEnumExists) {
        await pool.query("CREATE TYPE availability_status AS ENUM ( 'available', 'booked' );");
      }

      await pool.query(
        "CREATE TABLE vehicles ( id SERIAL PRIMARY KEY, vehicle_name VARCHAR(150) NOT NULL, type vehicle_type NOT NULL, registration_number TEXT UNIQUE NOT NULL, daily_rent_price DECIMAL(10, 2) NOT NULL, availability_status availability_status NOT NULL, CONSTRAINT positive CHECK( daily_rent_price > 0 ) );"
      );
    }

    // Bookings table initialization
    const isBookingsTableExists = await checkExistingTable("bookings");

    if (!isBookingsTableExists) {
      const isBookingStatusEnumExists = await checkExistingEnum("booking_status");

      if (!isBookingStatusEnumExists) {
        await pool.query("CREATE TYPE booking_status AS ENUM ('active', 'cancelled', 'returned');");
      }

      await pool.query(
        "CREATE TABLE bookings ( id SERIAL PRIMARY KEY, customer_id INT NOT NULL, vehicle_id INT NOT NULL, rent_start_date DATE NOT NULL, rent_end_date DATE NOT NULL, total_price DECIMAL(10, 2) NOT NULL, status booking_status NOT NULL, CONSTRAINT after_start CHECK(rent_end_date > rent_start_date), CONSTRAINT fk_user FOREIGN KEY(customer_id) REFERENCES Users(id) ON DELETE CASCADE, CONSTRAINT fk_vehicle FOREIGN KEY(vehicle_id) REFERENCES Vehicles(id) ON DELETE CASCADE );"
      );
    }

    console.log("\n" + "-".repeat(36));
    console.log("| Data Base connected successfully |");
    console.log("-".repeat(36) + "\n");
  } catch (error: any) {
    console.error(error.message);
  }
}
