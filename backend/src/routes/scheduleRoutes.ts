import express from "express";
import { generateSchedule, getSchedule } from "../controllers/scheduleController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

// Apply auth middleware to all schedule routes
router.use(verifyToken);

router.post("/generate", generateSchedule);
router.get("/", getSchedule);

export default router;
