import { Router } from "express";
import { getProfile } from "../controllers/userController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

// Notice verifyToken is positioned right in the middle! It acts as the security guard.
router.get("/profile", verifyToken, getProfile);

export default router;
