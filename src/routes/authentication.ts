import { Router } from "express";
import { signup } from "../controllers/authentication/signup";
import { signin } from "../controllers/authentication/signin";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
