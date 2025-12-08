import { Router } from "express";
import { createBookingController } from "../controllers/bookings/createBookingController";
import { validateJwtToken } from "../middlewares/validateJwtToken";
import { requiredSelfOrAdmin } from "../middlewares/requiredSelfOrAdmin";
import { validatePayload } from "../middlewares/validatePayload";
import { bookingsrequiredSelfOrAdmin } from "../middlewares/bookingsRequiredSelfOrAdmin";
import { getAllBookingsController } from "../controllers/bookings/getAllBookingsController";
import { roleAuthorization } from "../middlewares/roleAuthorization";
import { updateBookingController } from "../controllers/bookings/updateBookingController";
import { validateUpdatingPayload } from "../middlewares/validateUpdatingPayload";

const router = Router();

router.get("/", validateJwtToken, roleAuthorization(["customer"]), getAllBookingsController);
router.post(
  "/",
  validateJwtToken,
  validatePayload(["customer_id", "vehicle_id", "rent_start_date", "rent_end_date"]),
  bookingsrequiredSelfOrAdmin,
  createBookingController
);
router.put(
  "/:bookingId",
  validateJwtToken,
  roleAuthorization(["customer"]),
  validateUpdatingPayload(["status"]),
  updateBookingController
);

export default router;
