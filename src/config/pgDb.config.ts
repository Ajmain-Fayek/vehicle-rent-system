import pg from "pg";
import envConfig from "./env.config";
import fs from "fs";
import path from "path";

const { Pool } = pg;

const pool = new Pool({ connectionString: envConfig.pgDb });

export default pool;

export async function checkDatabaseConnection() {
  try {
    const schemaPath = path.join(__dirname, "schema.init.sql");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    await pool.query(schema);
    console.log("Data Base connected successfully.");
  } catch (error: any) {
    console.error(error.message);
  }
}
