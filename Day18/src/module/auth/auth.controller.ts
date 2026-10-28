import type { Request, Response } from "express";
import { loginUser, registerUser } from "./auth.service.js";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email, and password are required",
      });
    }
    const result = await registerUser(name, email, password, role);

    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "EMAIL ALREADY EXISTS") {
      return res.json(409).json({
        message: "unable to create account",
      });
    }
    return res.status(500).json({ message: "internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required",
      });
    }

    const result = await loginUser(email, password);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "INVALID CREDENTIALS") {
      return res.status(401).json({
        message: "invalid credential",
      });
    }
    return res.status(500).json({ message: "internal server error" });
  }
}
