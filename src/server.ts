import express, { Request, Response } from "express";
import envConfig from "./config/env.config";
import { sendResponse } from "./utils/sendResponse";
import { checkDatabaseConnection } from "./config/pgDb.config";
import authenticationRoutes from "./routes/authenticationRoutes";
import vehiclesRoutes from "./routes/vehiclesRoutes";
import usersRoutes from "./routes/usersRoutes";
import bookingsRoutes from "./routes/bookingsRoutes";
import cron from "node-cron";
import { autoReturnTask } from "./scripts/autoReturnLogic";

const app = express();

app.use(express.json());

// ---------------------------------------------------------- //
//   Cron Task - autoReturn booking and available vehicle     //
// ---------------------------------------------------------- //

cron.schedule("0 0 * * *", autoReturnTask, { timezone: "Asia/Dhaka" });

//==========================//
//        Test APIs         //
//==========================//
app.get("/", async (req: Request, res: Response) => {
  return sendResponse(res, 200, true, "Welcome to the Vehicle Rental System portal");
});

app.get("/health-check", async (req: Request, res: Response) => {
  return sendResponse(res, 200, true, "Health Ok.");
});

// ---------------------//
// Production APIs      //
// ---------------------//
app.use("/api/v1/auth", authenticationRoutes);
app.use("/api/v1/vehicles", vehiclesRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/bookings", bookingsRoutes);

// -----------------------------------------------------//
// Start the server after DB connection is established  //
// -----------------------------------------------------//
checkDatabaseConnection().then(() => {
  app.listen(envConfig.port, () => {
    console.log(`Server is running at PORT: ${envConfig.port} - http://localhost:${envConfig.port}`);
  });
});
