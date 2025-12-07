import { Router } from "express";
import { createBookingController } from "../controllers/bookings/createBookingController";
import { validateJwtToken } from "../middlewares/validateJwtToken";
import { requiredSelfOrAdmin } from "../middlewares/requiredSelfOrAdmin";
import { validatePayload } from "../middlewares/validatePayload";
import { bookingsrequiredSelfOrAdmin } from "../middlewares/bookingsRequiredSelfOrAdmin";

const router = Router();

router.post(
  "/",
  validateJwtToken,
  validatePayload(["customer_id", "vehicle_id", "rent_start_date", "rent_end_date"]),
  bookingsrequiredSelfOrAdmin,
  createBookingController
);

export default router;
