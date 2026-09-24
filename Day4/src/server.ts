import express from "express";
import type { Request, Response, NextFunction } from "express";
import taskRoutes from "./routes/taskRoutes.js";
import { logger } from "./middleware/logger.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";


const app= express();

app.use(express.json());
app.use(logger);

app.use("/tasks",taskRoutes);


app.get("/health",(req, res)=>{
    res.json({
        "status":"ok"
    })
});

app.use(notFound);
app.use(errorHandler)
app.listen(3000, ()=>{
    console.log("Server running on Port 3000");
})