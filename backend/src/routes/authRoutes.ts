import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController";

const router = Router();

// When someone goes to POST /register, Express sends them to the registerUser controller!
router.post("/register", registerUser);

// When someone goes to POST /login, Express sends them to the loginUser controller!
router.post("/login", loginUser);

export default router;
