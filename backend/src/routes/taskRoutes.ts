import express from "express";
import { 
  createTask, 
  getTasks, 
  getTaskById, 
  updateTask, 
  deleteTask 
} from "../controllers/taskController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

// Apply auth middleware to all task routes
router.use(verifyToken);

// Task Routes
router.post("/", createTask);           // Create a task
router.get("/", getTasks);              // Get all tasks for the user
router.get("/:id", getTaskById);        // Get a specific task
router.put("/:id", updateTask);         // Update a task
router.delete("/:id", deleteTask);      // Delete a task

export default router;
