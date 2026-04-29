import { Router } from "express";
import { improveUserSchedule, chatWithAI, getNextTask } from "../controllers/aiController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

// Protect all AI routes with the verifyToken middleware
router.use(verifyToken);

router.post("/improve", improveUserSchedule);
router.post("/chat", chatWithAI);
router.get("/next-task", getNextTask);

export default router;
