import cors from "cors";
import express from "express";
import prisma from "./lib/prisma";
import projectRoutes from "./routes/project.routes";
import issueRoutes from "./routes/issue.routes";
const app= express();

app.use(cors());
app.use(express.json());


app.use("/api/projects",projectRoutes);
app.use("/api/issues", issueRoutes);

export default app;