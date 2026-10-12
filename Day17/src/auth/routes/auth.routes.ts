import { registerController,loginController,meController } from "../controller/auth.controller.js";
import { Router } from "express";

import { authMiddleWare } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.midddleware.js";

export const authRoutes= Router();


authRoutes.post("/register",registerController);
authRoutes.post("/login",loginController);
authRoutes.get("/me",authMiddleWare,meController);
authRoutes.get("/admin-test", authMiddleWare,requireRole("ADMIN"),(req,res)=>{
    res.json({
        message:"Admin access granted",
    })
})