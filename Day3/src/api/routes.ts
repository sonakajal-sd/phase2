import type { IncomingMessage , ServerResponse } from "node:http";
import { getAllTasks,getTask,addTask } from "../services/taskService.js";
import { sendResponse } from "./response.js";

export async function handleRequest(
    req:IncomingMessage,
    res:ServerResponse
){
    if(req.method === "GET" && req.url === "/tasks"){
        const tasks= await getAllTasks();
        sendResponse(res, 200, tasks);
        return;
    }
    if(req.method ==="GET"&&req.url?.startsWith("/tasks/")){
        const id=Number(req.url.split("/")[2]);
        const task= await getTask(id);

        if(!task){
            sendResponse(res,404, {error:"task not found"});
            return;
        }
        sendResponse(res,200,task);
        return;
    }

    if(req.method ==="POST" && req.url ==="/tasks"){
        let body="";
        req.on("data",(chunk)=>{
            body+=chunk;
        });

        req.on("end",async()=>{  
            try{
                const data= JSON.parse(body);
                const task=await addTask(data);

                sendResponse(res, 201, task);
            }catch(error){
                sendResponse(res, 400,{error: error instanceof Error ? error.message : "Invalid request"});

            }
        })
    }
    return;
}