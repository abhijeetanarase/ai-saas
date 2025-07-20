/**
 * The main application file.
 *
 * @module app
 */

import express from "express";
import { errorHandler } from "./middlewares/error";
import cors from "cors";
import connectDB from "./configs/connectDB";
import contentRouter from "./routes/blogRoutes"
import templateRoutes from './routes/template';

require("dotenv").config();

/**
 * The express application.
 *
 * @type {Express}
 */
const app = express();

/**
 * Enable CORS.
 */
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/**
 * Parse JSON bodies.
 */
app.use(express.json());

connectDB();

/**
 * Route for handling URLs.
 */

app.use("/api/blog", contentRouter);
app.use("/api/templates", templateRoutes);

/**
 * Error handler middleware.
 */
app.use(errorHandler);

export default app;
