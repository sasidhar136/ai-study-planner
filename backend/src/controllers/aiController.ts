import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { PrismaClient } from "@prisma/client";
import * as aiService from "../services/aiService";

const prisma = new PrismaClient();

export const improveUserSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?.userId;

    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
      return;
    }

    // Get the most recent schedule for the user
    const schedule = await prisma.schedule.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            task: true,
          },
        },
      },
    });

    if (!schedule) {
      res.status(404).json({ 
        success: false, 
        message: "No schedule found to improve" 
      });
      return;
    }

    const improvedVersion = await aiService.improveSchedule(schedule);

    res.json({
      success: true,
      data: {
        originalScheduleId: schedule.id,
        improvedSchedule: improvedVersion,
      }
    });
  } catch (error) {
    console.error("Error improving schedule:", error);
    res.status(503).json({ 
      success: false, 
      message: "AI service is currently busy or unavailable. Please try again in a few moments." 
    });
  }
};

export const chatWithAI = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?.userId;
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ 
        success: false, 
        message: "Message is required" 
      });
      return;
    }

    // Optional: Get user context (tasks/schedules) to provide to AI
    const tasks = await prisma.task.findMany({
      where: { userId },
      take: 5,
    });

    const aiResponse = await aiService.chatWithAI(message, { recentTasks: tasks });

    res.json({ 
      success: true,
      data: aiResponse 
    });
  } catch (error: any) {
    console.error("Error in AI chat:", error);
    res.status(500).json({ 
      success: false,
      message: "AI chat failed", 
      error: error.message || "Unknown error" 
    });
  }
};

export const getNextTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const schedule = await prisma.schedule.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { task: true }
        }
      }
    });

    if (!schedule || schedule.items.length === 0) {
      res.status(404).json({ success: false, message: "No schedule found" });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTasks = schedule.items.filter(item => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate.getTime() === today.getTime() && item.task.status === "PENDING";
    });

    if (todayTasks.length === 0) {
      res.json({ success: true, data: null, message: "You have no pending tasks for today!" });
      return;
    }

    // Sort by priority (HIGH > MEDIUM > LOW)
    const priorityMap: Record<string, number> = { "HIGH": 3, "MEDIUM": 2, "LOW": 1 };
    todayTasks.sort((a, b) => {
      const pA = priorityMap[a.task.priority] || 2;
      const pB = priorityMap[b.task.priority] || 2;
      return pB - pA;
    });

    const bestTask = todayTasks[0];
    if (!bestTask) {
       res.json({ success: true, data: null, message: "You have no pending tasks for today!" });
       return;
    }

    res.json({ 
      success: true, 
      data: bestTask.task 
    });
  } catch (error) {
    console.error("Error getting next task:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
