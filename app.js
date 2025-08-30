import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import createError from "http-errors";
import authRoutes from "./routes/auth.js";
import meRoutes from "./routes/me.js";
import logsRoutes from "./routes/logs.js";
import doctorRoutes from "./routes/doctor.js";
import chatRoutes from "./routes/chat.js";
import alertsRoutes from "./routes/alerts.js";
import demoRoutes from "./routes/demo.js";
import { notFound, errorHandler } from "./middleware/error.js";

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Feature routes
app.use("/api/auth", authRoutes);
app.use("/api/me", meRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/alerts", alertsRoutes);
app.use("/api/demo", demoRoutes);

// 404 + error handling
app.use((_req, _res, next) => next(createError(404, "Route not found")));
app.use(notFound);
app.use(errorHandler);

export default app;
