import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ error: "Malformed JSON body" });
  }

  console.error(error);

  return res.status(500).json({ error: "Internal server error" });
};
