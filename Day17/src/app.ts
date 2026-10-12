import express from "express";
import { authRoutes } from "./auth/routes/auth.routes.js";

const app= express();

app.use(express.json());


app.use("/auth",authRoutes);
// POST /auth/register

export default app;
