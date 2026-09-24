import { getAllTasks ,getSingleTask,addTask,editTask, removeTask } from "../services/taskService.js";
import type { Request, Response } from "express";

export const getTasks= async (req:Request , res:Response)=>{

    const data= await getAllTasks();
    return res.json(data);
}

export const getSingleTsk = async (req:Request, res:Response)=>{
    const id =Number(req.params.id);
    const task= await getSingleTask(id);

    if(!task){
        return res.status(404).json({
            error:"Task not found"
        });
    };

    return res.json(task);
}

export const createTask= async (req:Request, res:Response)=>{
    const {title}= req.body;

    if(!title){
        return res.status(400).json({
            error:"Title is required"
        });
    }
    const task= await addTask(title);
    return res.status(201).json(task);
}

export const updateTaskController= async( req:Request, res:Response)=>{
    const id=Number(req.params.id);
    const updateTask= await editTask(id, req.body);

    if(!updateTask){
        return res.status(404).json({
            error:"not Found"
        });
    }
    return res.json(updateTask)
}

export const deleteTaskController= async(req:Request, res:Response)=>{
    const id= Number(req.params.id);

    const deleteTask= await removeTask(id);

    if(!deleteTask){
        return res.status(404).json({
         "error":"Task not found"
        });
    };
    return res.status(204).send();
};
