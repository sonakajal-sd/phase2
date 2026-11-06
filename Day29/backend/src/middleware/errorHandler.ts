import type { NextFunction, Request, Response } from "express";

// Express 5 sends any error thrown in an async route here.
export function errorHandler(error: unknown, req: Request, res: Response, next: NextFunction) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
}
