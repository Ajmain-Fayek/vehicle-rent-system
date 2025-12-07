import { Router } from "express";
import { getAllUsersController } from "../controllers/users/getAllUsersController";
import { validateJwtToken } from "../middlewares/validateJwtToken";
import { roleAuthorization } from "../middlewares/roleAuthorization";

const router = Router();

router.get("/", validateJwtToken, roleAuthorization(["admin"]), getAllUsersController);

export default router;
