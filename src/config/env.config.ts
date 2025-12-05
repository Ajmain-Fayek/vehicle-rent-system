import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const envConfig = {
  env: process.env.NODE_ENV,
  port: process.env.PORT ? Number(process.env.PORT) : 5000,
  pgDb: process.env.DB_URL, // PostgreSQL
  saltRounds: process.env.SALT_ROUNDS ? Number(process.env.SALT_ROUNDS) : 10,
};

export default envConfig;
