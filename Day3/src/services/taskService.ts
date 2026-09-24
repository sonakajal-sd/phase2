import { getTasks,getTasksById,createTask } from "../repositories/taskRepository.js";

export async function getAllTasks(){
    return await getTasks();
}

export async function getTask(id:number){
   return await getTasksById(id);
}

export async function addTask(data:{
    title:string,
    completed:boolean;
}){
  if(!data.title || typeof data.title !=="string"){
    throw new Error("title is required");
  }
  if(typeof data.completed !=="boolean"){
    throw new Error("Completed must be a boolean");
  }

  return await createTask(data);
}