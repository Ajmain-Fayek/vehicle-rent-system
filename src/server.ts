import express, { Request, Response } from "express";
import envConfig from "./config/env.config";
import { checkDatabaseConnection } from "./config/pgDb.config";

const app = express();

app.use(express.json());

//==========================//
//        Test APIs         //
//==========================//
app.get("/", async (req: Request, res: Response) => {
  res.send({ success: true, message: "Welcome to the Vehicle Rental System portal." });
});

app.get("/health-check", async (req: Request, res: Response) => {
  res.send({ success: true, message: "Health Ok." });
});

// ---------------------//
// Production APIs      //
// ---------------------//
app.use("/api/v1/auth");

// -----------------------------------------------------//
// Start the server after DB connection is established  //
// -----------------------------------------------------//
checkDatabaseConnection().then(() => {
  app.listen(envConfig.port, () => {
    console.log(`Server is running at PORT: ${envConfig.port} - http://localhost:${envConfig.port}`);
  });
});
