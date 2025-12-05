import { Router } from "express";
import { signupController } from "../controllers/authentication/signupController";
import { signinController } from "../controllers/authentication/signinController";
import { validatePayload } from "../middlewares/validatePayload";

const router = Router();

router.post("/signup", validatePayload(["name", "email", "password", "phone", "role"]), signupController);
router.post("/signin", validatePayload(["email", "password"]), signinController);

export default router;
