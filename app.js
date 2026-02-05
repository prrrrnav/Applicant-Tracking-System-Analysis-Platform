import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { redisClient } from "./config/redis.js";
dotenv.config();

import analyzeRoutes from "./routes/analyze.js";

import testRoutes from "./routes/health.js";

await redisClient.set("test", "hello");
console.log(await redisClient.get("test"));



const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/analyze", analyzeRoutes);
app.use("/api", testRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
