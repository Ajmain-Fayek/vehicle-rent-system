import { Router } from "express";
import { validatePayload } from "../middlewares/validatePayload";
import { validateJwtToken } from "../middlewares/validateJwtToken";
import { roleAuthorization } from "../middlewares/roleAuthorization";
import { createVehiclesController } from "../controllers/vehicles/createVehiclesController";
import { getAllVehicles } from "../controllers/vehicles/getAllVehicles";
import { getSpecificVehicles } from "../controllers/vehicles/getSpecificVehicle";
import { updateVehicles } from "../controllers/vehicles/updateVehicle";
import { validateUpdatingPayload } from "../middlewares/validateUpdatingPayload";

const router = Router();

router.get("/", getAllVehicles);
router.get("/:vehicleId", getSpecificVehicles);
router.put(
  "/:vehicleId",
  validateJwtToken,
  roleAuthorization(["admin"]),
  validateUpdatingPayload(["vehicle_name", "type", "registration_number", "daily_rent_price", "availability_status"]),
  updateVehicles
);
router.post(
  "/",
  validateJwtToken,
  roleAuthorization(["admin"]),
  validatePayload(["vehicle_name", "type", "registration_number", "daily_rent_price", "availability_status"]),
  createVehiclesController
);

export default router;
