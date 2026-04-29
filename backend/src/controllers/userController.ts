import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        energyType: true,
        streakCount: true,
        lastStudyDate: true,
        createdAt: true
      }
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?.userId;
    const { energyType } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    if (energyType && !["morning", "night"].includes(energyType)) {
      res.status(400).json({ success: false, message: "Invalid energy type" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        energyType: energyType !== undefined ? energyType : undefined
      }
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
