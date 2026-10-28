import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import type { UserRole } from "../generated/prisma/enums.js";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export interface AuthRequest extends Request {
  userId?: number;
  role?: UserRole;
}

interface PayloadType {
  userId: number;
  role: UserRole;
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ message: "authentication required" });
  }
  const [type, value] = authorization.split(" ");

  if (type !== "Bearer" || !value) {
    return res.status(401).json({ message: "invalid authorization header" });
  }

  try {
    const payload = jwt.verify(value, JWT_SECRET!) as PayloadType;

    req.userId = payload.userId;
    req.role = payload.role;

    next();
  } catch (error) {
    return res.status(401).json({ message: "invalid or expired token" });
  }
}
