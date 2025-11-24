/**
 * Authentication and user management routes.
 *
 * Routes:
 * - POST /auth/register - Register a new user
 * - POST /auth/login - Login user
 * - GET /users - List users (protected)
 * - POST /users - Create user (protected, admin only)
 * - GET /users/:userId - Get user by ID (protected)
 * - PATCH /users/:userId - Update user (protected)
 * - DELETE /users/:userId - Delete user (protected, admin only)
 */

import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.js";

export const authRouter = Router();

// Public auth routes
authRouter.post("/auth/register", userController.register);
authRouter.post("/auth/login", userController.login);

// User management routes (protected)
authRouter.get("/users", authenticate, userController.listUsers);
authRouter.post("/users", authenticate, userController.register); // Admin creation
authRouter.get("/users/:userId", authenticate, userController.getUser);
authRouter.patch("/users/:userId", authenticate, userController.updateUser);
authRouter.delete("/users/:userId", authenticate, userController.deleteUser);

export default authRouter;
