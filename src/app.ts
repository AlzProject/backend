/**
 * Express application setup.
 *
 * Configures middleware, routes, and error handling.
 */

import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import router from "./routes/index.js";

export const createApp = () => {
  const app = express();

  // CORS middleware
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    
    next();
  });

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint (no auth required)
  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Routes
  app.use("/v1", router);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: {
        message: "Route not found",
        statusCode: 404,
      },
    });
  });

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};

export default createApp;
