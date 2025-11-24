/**
 * Main router.
 *
 * Mounts all feature routers to the application.
 */

import { Router } from "express";
import authRouter from "./auth.js";

const router = Router();

// Mount auth/user routes
router.use(authRouter);

export default router;
