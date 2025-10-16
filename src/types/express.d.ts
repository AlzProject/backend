/**
 * Augment Express Request to include `user` populated by JWT middleware.
 *
 * This file provides a project-wide declaration so `req.user` is available
 * with the `TokenPayload` shape defined in `src/types/jwt.ts`.
 */
declare global {
  namespace Express {
    interface Request {
      /** Decoded JWT payload attached by `src/middlewares/auth.ts` */
      user?: import("./jwt").TokenPayload;
    }
  }
}

export {};
