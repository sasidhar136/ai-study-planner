import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// A controller to handle registering
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // 2. Hash the password (encrypt it)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Save the new user to the database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // 4. Send success response (but don't send the password back!)
    res.status(201).json({ 
      message: "User registered successfully!", 
      user: { id: newUser.id, email: newUser.email } 
    });

  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// A controller to handle logging in
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by their email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    // 2. Compare the text password to the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // 3. Generate a JSON Web Token (JWT)
    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET || "default_secret", 
      { expiresIn: "7d" }
    );

    // 4. Send the token back to the frontend
    res.json({
      message: "Successfully logged in",
      token,
      user: { id: user.id, email: user.email }
    });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
