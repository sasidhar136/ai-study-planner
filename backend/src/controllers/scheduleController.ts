import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/authMiddleware";
import { generateScheduleLogic } from "../utils/scheduler";

const prisma = new PrismaClient();

const getUserId = (req: AuthRequest): string | null => {
  if (req.user && typeof req.user === 'object' && 'userId' in req.user) {
    return (req.user as any).userId;
  }
  return null;
};

/**
 * POST /api/schedule/generate
 * Fetches user tasks, generates a schedule, and saves it to the database.
 */
export const generateSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: "Unauthorized" 
      });
      return;
    }

    // 1. Fetch user tasks (Pending tasks)
    const [user, tasks] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.task.findMany({
        where: { userId, status: "PENDING" }
      })
    ]);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (tasks.length === 0) {
      res.status(400).json({ 
        success: false, 
        message: "No pending tasks found to generate schedule" 
      });
      return;
    }

    // 2. Generate logic
    const allocations = generateScheduleLogic(
      tasks.map(t => ({
        id: t.id,
        title: t.title,
        dueDate: t.dueDate,
        estimatedHours: t.estimatedHours,
        priority: t.priority
      })),
      user.energyType
    );

    // 3. Save in DB using a transaction
    const schedule = await prisma.$transaction(async (tx) => {
      // We'll keep one primary schedule for the user for now
      // Delete old schedules to keep it clean
      await tx.schedule.deleteMany({ where: { userId } });

      const newSchedule = await tx.schedule.create({
        data: {
          userId,
          items: {
            create: allocations.map(a => ({
              taskId: a.taskId,
              date: a.date,
              hours: a.hours
            }))
          }
        },
        include: {
          items: {
            include: {
              task: true
            }
          }
        }
      });
      return newSchedule;
    });

    res.status(201).json({ 
      success: true,
      message: "Schedule generated successfully", 
      data: schedule 
    });
  } catch (error) {
    console.error("Error generating schedule:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

/**
 * GET /api/schedule
 * Retrieves the latest generated schedule for the user.
 */
export const getSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: "Unauthorized" 
      });
      return;
    }

    const schedule = await prisma.schedule.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            task: true
          },
          orderBy: { date: 'asc' }
        }
      }
    });

    if (!schedule) {
      res.status(404).json({ 
        success: false, 
        message: "No schedule found" 
      });
      return;
    }

    res.json({ 
      success: true,
      data: schedule 
    });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};
