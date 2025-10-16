import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { TokenPayload } from "../types/jwt";

/**
 * Express middleware to authenticate requests using a Bearer JWT token.
 *
 * Behavior:
 * - Reads the `Authorization` header and expects the scheme `Bearer <token>`.
 * - Verifies the token using the `JWT_SECRET` from `src/config` or environment.
 * - On success, attaches the decoded token payload to `req.user`.
 * - On failure, responds with `401 Unauthorized` or `403 Forbidden`.
 *
 * @param req - Express request object. Augmented with `user?: TokenPayload` on success.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader =
    (req.headers["authorization"] || req.headers["Authorization"]) as
      | string
      | undefined;

  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    return res.status(401).json({
      message: "Invalid Authorization header format",
    });
  }

  const token = parts[1];

  const secret = (config && (config as any).JWT_SECRET) ||
    process.env.JWT_SECRET;
  if (!secret || typeof secret !== "string") {
    return res.status(500).json({ message: "Authentication not configured" });
  }

  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;
    req.user = decoded;

    return next();
  } catch (err: any) {
    if (err && err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(403).json({ message: "Invalid token" });
  }
}
