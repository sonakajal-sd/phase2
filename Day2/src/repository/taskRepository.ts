import type {Task} from "../types/task.js";

import {readFile,writeFile,mkdir } from "node:fs/promises";


export async function getTasks():Promise<Task[]>{

    try{
    const data= await readFile("data/tasks.json", "utf-8");
    const tasks:Task[]= JSON.parse(data);
    return tasks;
    } catch(error){
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return [];
        }

        throw error;
    }

}


export async function saveTasks(tasks:Task[]):Promise<void>{
   const data = JSON.stringify(tasks, null,2);

   await mkdir("data",{recursive:true});

   await writeFile("data/tasks.json",data, "utf-8");
}