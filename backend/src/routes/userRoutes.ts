import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/userController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

// Notice verifyToken is positioned right in the middle! It acts as the security guard.
router.get("/profile", verifyToken, getProfile);
router.patch("/profile", verifyToken, updateProfile);

export default router;
