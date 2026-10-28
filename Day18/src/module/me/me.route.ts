import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { getUser } from "./me.controller.js";

const userRoute = Router();

userRoute.get("/", authenticate, getUser);

export default userRoute;
