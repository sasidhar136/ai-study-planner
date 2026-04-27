import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  // Since they had to pass the AuthMiddleware to get here, we are 100% sure req.user exists and is authentic!
  res.json({
    message: "Welcome to the VIP area!",
    secureData: "This is top secret study planner data.",
    yourDecodedTokenData: req.user
  });
};
