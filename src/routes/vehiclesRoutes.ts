import { Router } from "express";
import { validatePayload } from "../middlewares/validatePayload";
import { validateJwtToken } from "../middlewares/validateJwtToken";
import { roleAuthorization } from "../middlewares/roleAuthorization";
import { validateUpdatingPayload } from "../middlewares/validateUpdatingPayload";
import { updateVehiclesController } from "../controllers/vehicles/updateVehicleController";
import { createVehiclesController } from "../controllers/vehicles/createVehiclesController";
import { getAllVehiclesController } from "../controllers/vehicles/getAllVehiclesController";
import { getSpecificVehiclesController } from "../controllers/vehicles/getSpecificVehicleController";
import { deleteVehiclesController } from "../controllers/vehicles/deleteVehicleController";

const router = Router();

router.get("/", getAllVehiclesController);

router.get("/:vehicleId", getSpecificVehiclesController);

router.put(
  "/:vehicleId",
  validateJwtToken,
  roleAuthorization(["admin"]),
  validateUpdatingPayload(["vehicle_name", "type", "registration_number", "daily_rent_price", "availability_status"]),
  updateVehiclesController
);

router.post(
  "/",
  validateJwtToken,
  roleAuthorization(["admin"]),
  validatePayload(["vehicle_name", "type", "registration_number", "daily_rent_price", "availability_status"]),
  createVehiclesController
);

router.delete("/:vehicleId", validateJwtToken, roleAuthorization(["admin"]), deleteVehiclesController);

export default router;
