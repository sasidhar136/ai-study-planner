import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/authMiddleware";

const prisma = new PrismaClient();

// Helper to get userId safely from the request
const getUserId = (req: AuthRequest): string | null => {
  if (req.user && typeof req.user === 'object' && 'userId' in req.user) {
    return req.user.userId;
  }
  return null;
};

// Create a new task
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: "Unauthorized" 
      });
      return;
    }

    const { title, description, status, priority, dueDate, estimatedHours } = req.body;

    if (!title) {
      res.status(400).json({ 
        success: false, 
        message: "Title is required" 
      });
      return;
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || "PENDING",
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedHours: estimatedHours !== undefined ? parseFloat(estimatedHours) : 1.0,
        userId
      }
    });

    res.status(201).json({ 
      success: true,
      message: "Task created successfully", 
      data: task 
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Get all tasks for the logged in user
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: "Unauthorized" 
      });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ 
      success: true,
      data: tasks 
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Get a specific task by ID
export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: "Unauthorized" 
      });
      return;
    }

    const id = req.params.id as string;

    const task = await prisma.task.findFirst({
      where: { id, userId } // Ensure the task belongs to the user
    });

    if (!task) {
      res.status(404).json({ 
        success: false, 
        message: "Task not found" 
      });
      return;
    }

    res.json({ 
      success: true,
      data: task 
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Update a task
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: "Unauthorized" 
      });
      return;
    }

    const id = req.params.id as string;
    const { title, description, status, priority, dueDate, estimatedHours } = req.body;

    // First check if the task exists and belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: { id, userId }
    });

    if (!existingTask) {
      res.status(404).json({ 
        success: false, 
        message: "Task not found or unauthorized to edit" 
      });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existingTask.title,
        description: description !== undefined ? description : existingTask.description,
        status: status !== undefined ? status : existingTask.status,
        priority: priority !== undefined ? priority : existingTask.priority,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : existingTask.dueDate,
        estimatedHours: estimatedHours !== undefined ? parseFloat(estimatedHours) : existingTask.estimatedHours,
      }
    });

    // --- Streak Logic ---
    if (status === "COMPLETED" && existingTask.status !== "COMPLETED") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        let newStreak = user.streakCount;
        const lastStudy = user.lastStudyDate ? new Date(user.lastStudyDate) : null;
        if (lastStudy) {
          lastStudy.setHours(0, 0, 0, 0);
        }

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (!lastStudy) {
          newStreak = 1;
        } else if (lastStudy.getTime() === yesterday.getTime()) {
          newStreak += 1;
        } else if (lastStudy.getTime() < yesterday.getTime()) {
          newStreak = 1;
        }
        // If lastStudy is today, streak remains the same

        await prisma.user.update({
          where: { id: userId },
          data: {
            streakCount: newStreak,
            lastStudyDate: new Date()
          }
        });
      }
    }
    // --------------------

    res.json({ 
      success: true,
      message: "Task updated successfully", 
      data: updatedTask 
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Delete a task
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: "Unauthorized" 
      });
      return;
    }

    const id = req.params.id as string;

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id, userId }
    });

    if (!existingTask) {
      res.status(404).json({ 
        success: false, 
        message: "Task not found or unauthorized to delete" 
      });
      return;
    }

    await prisma.task.delete({
      where: { id }
    });

    res.json({ 
      success: true,
      message: "Task deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};
