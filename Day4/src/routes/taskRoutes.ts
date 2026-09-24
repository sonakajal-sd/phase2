import { create } from "node:domain";
import { getTasks,getSingleTsk, createTask, updateTaskController,deleteTaskController} from "../controllers/taskControllers.js";
import express from "express";

const router= express.Router();  //importing router

router.get("/",getTasks);
router.get("/:id",getSingleTsk);
router.post("/",createTask);
router.patch("/:id",updateTaskController);
router.delete("/:id", deleteTaskController);


// to check the post DataT
// curl -X POST http://localhost:3000/tasks \
// -H "Content-Type: application/json" \
// -d '{"title":"Learn Middleware"}'

export default router;
