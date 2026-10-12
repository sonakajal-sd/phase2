import { registerController,loginController,meController } from "../controller/auth.controller.js";
import { Router } from "express";

import { authMiddleWare } from "../middleware/auth.middleware.js";

export const authRoutes= Router();


authRoutes.post("/register",registerController);
authRoutes.post("/login",loginController);
authRoutes.get("/me",authMiddleWare,meController);