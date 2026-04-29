import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import taskRoutes from "./routes/taskRoutes";
import scheduleRoutes from "./routes/scheduleRoutes";
import aiRoutes from "./routes/aiRoutes";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/ai", aiRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "API is healthy and running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
