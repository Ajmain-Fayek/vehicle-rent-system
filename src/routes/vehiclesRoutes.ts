import { Router } from "express";
import { createVehiclesController } from "../controllers/vehicles/createVehiclesController";
import { validatePayload } from "../middlewares/validatePayload";
import { validateJwtToken } from "../middlewares/validateJwtToken";
import { roleAuthorization } from "../middlewares/roleAuthorization";

const router = Router();

router.post(
  "/",
  validatePayload(["vehicle_name", "type", "registration_number", "daily_rent_price", "availability_status"]),
  validateJwtToken,
  roleAuthorization(["admin"]),
  createVehiclesController
);

export default router;
