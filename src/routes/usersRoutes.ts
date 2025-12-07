import { Router } from "express";
import { getAllUsersController } from "../controllers/users/getAllUsersController";
import { validateJwtToken } from "../middlewares/validateJwtToken";
import { roleAuthorization } from "../middlewares/roleAuthorization";
import { validateUpdatingPayload } from "../middlewares/validateUpdatingPayload";
import { requiredSelfOrAdmin } from "../middlewares/requiredSelfOrAdmin";
import { updateUserController } from "../controllers/users/updateUserController";
import { deleteUserController } from "../controllers/users/deleteUserController";

const router = Router();

router.get("/", validateJwtToken, roleAuthorization(["admin"]), getAllUsersController);
router.put(
  "/:userId",
  validateJwtToken,
  requiredSelfOrAdmin,
  validateUpdatingPayload(["name", "email", "phone", "role"]),
  updateUserController
);
router.delete("/:userId", validateJwtToken, roleAuthorization(["admin"]), deleteUserController);

export default router;
