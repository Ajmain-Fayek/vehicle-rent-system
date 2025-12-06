import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const privateSecret = fs.readFileSync(path.join(process.cwd(), "private.key"), "utf8");
const publicSecret = fs.readFileSync(path.join(process.cwd(), "public.key"), "utf8");

const envConfig = {
  env: String(process.env.NODE_ENV),
  port: process.env.PORT ? Number(process.env.PORT) : 5000,
  pgDb: String(process.env.DB_URL), // PostgreSQL
  saltRounds: process.env.SALT_ROUNDS ? Number(process.env.SALT_ROUNDS) : 10,
  jwtPrivateSecret: privateSecret,
  jwtPublicSecret: publicSecret,
};

export default envConfig;
