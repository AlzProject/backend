/**
 * Tests and sections routes.
 *
 * Routes:
 * - GET /tests - List tests
 * - POST /tests - Create test (protected)
 * - GET /tests/:testId - Get test
 * - PATCH /tests/:testId - Update test (protected, creator/admin)
 * - DELETE /tests/:testId - Delete test (protected, creator/admin)
 * - POST /tests/:testId/sections - Create section (protected, creator/admin)
 * - GET /tests/:testId/sections - List sections
 * - GET /sections/:sectionId - Get section
 * - PATCH /sections/:sectionId - Update section (protected, creator/admin)
 * - DELETE /sections/:sectionId - Delete section (protected, creator/admin)
 */

import { Router } from "express";
import * as testController from "../controllers/test.controller.js";
import * as sectionController from "../controllers/section.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { requireTestModifyPermission, requireSectionModifyPermission } from "../middlewares/testAuthorization.js";

export const testsRouter = Router();

// Public test routes
testsRouter.get("/tests", testController.listTests);
testsRouter.get("/tests/:testId", testController.getTest);

// Protected test routes
testsRouter.post("/tests", authenticate, testController.createTest);
testsRouter.patch("/tests/:testId", authenticate, requireTestModifyPermission, testController.updateTest);
testsRouter.delete("/tests/:testId", authenticate, requireTestModifyPermission, testController.deleteTest);

// Protected section routes within test
testsRouter.post("/tests/:testId/sections", authenticate, requireTestModifyPermission, testController.createSection);
testsRouter.get("/tests/:testId/sections", testController.listSections);

// Public section routes
testsRouter.get("/sections/:sectionId", sectionController.getSection);

// Protected section modification routes
testsRouter.patch("/sections/:sectionId", authenticate, requireSectionModifyPermission, sectionController.updateSection);
testsRouter.delete("/sections/:sectionId", authenticate, requireSectionModifyPermission, sectionController.deleteSection);

export default testsRouter;
