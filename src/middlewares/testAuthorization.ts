/**
 * Test and section authorization middleware.
 *
 * Provides middleware to check if user can modify tests and sections:
 * - requireTestModifyPermission - Check if user can modify test
 * - requireSectionModifyPermission - Check if user can modify section
 */

import type { Request, Response, NextFunction } from "express";
import { AuthorizationError, NotFoundError, asyncHandler } from "./errorHandler.js";
import * as testService from "../services/test.service.js";
import * as sectionService from "../services/section.service.js";

/**
 * Require permission to modify test
 */
export const requireTestModifyPermission = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AuthorizationError("User not authenticated");
    }

    const testId = parseInt(req.params.testId);
    const userId = parseInt((req.user as any).sub);
    const userType = (req.user as any).type;

    const canModify = await testService.canModifyTest(testId, userId, userType);

    if (!canModify) {
      throw new AuthorizationError(
        "You can only modify your own tests or be an admin"
      );
    }

    next();
  }
);

/**
 * Require permission to modify section
 */
export const requireSectionModifyPermission = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AuthorizationError("User not authenticated");
    }

    const sectionId = parseInt(req.params.sectionId);
    const userId = parseInt((req.user as any).sub);
    const userType = (req.user as any).type;

    try {
      const testId = await sectionService.getTestIdForSection(sectionId);
      const canModify = await testService.canModifyTest(testId, userId, userType);

      if (!canModify) {
        throw new AuthorizationError(
          "You can only modify sections in your own tests or be an admin"
        );
      }

      next();
    } catch (err) {
      if (err instanceof AuthorizationError) {
        throw err;
      }
      if (err instanceof Error && err.message.includes("not found")) {
        throw new NotFoundError("Section");
      }
      throw err;
    }
  }
);
