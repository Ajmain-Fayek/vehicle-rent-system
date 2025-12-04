import express, { Request, Response } from "express";
import envConfig from "./config/env.config";
import { checkDatabaseConnection } from "./config/pgDb.config";

const app = express();

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.send({ success: true, message: "Welcome to the Vehicle Rental System portal." });
});
app.get("/health-check", async (req: Request, res: Response) => {
  res.send({ success: true, message: "Health Ok." });
});

app.listen(envConfig.port, () => {
  console.log(`Server is running at PORT: ${envConfig.port} - http://localhost:${envConfig.port}`);
});

checkDatabaseConnection();
