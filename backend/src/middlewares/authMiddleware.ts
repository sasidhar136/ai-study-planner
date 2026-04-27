import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// We extend the standard Express Request so we can securely attach the user's data to it
export interface AuthRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // 1. Check if the user sent a token in the Authorization header
  const authHeader = req.header("Authorization");
  
  // A standard format is 'Bearer <token>'. Let's check for it.
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Access Denied. Security Guard says: No VIP token provided!" });
    return;
  }

  // 2. Extract just the token part (cut off the word 'Bearer ')
  const token = authHeader.split(" ")[1];

  try {
    // 3. Verify the token using your exact secret key from .env
    const secret = (process.env.JWT_SECRET as string) || "default_secret";
    const verified = jwt.verify(token as string, secret);
    
    // 4. Check passed! Attach the verified user payload (which has the userId) to the request
    req.user = verified;
    
    // 5. Tell Express: "They are clear! Move them onto the controller."
    next();
  } catch (error) {
    res.status(401).json({ message: "Access Denied. Invalid or expired token." });
    return;
  }
};
