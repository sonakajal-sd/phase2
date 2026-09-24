import { getTasks ,getTaskById, createTask, updateTask, deleteTask} from "../repositories/taskRepository.js";

export async function getAllTasks(){
    return getTasks();
}

export async function getSingleTask(id:number){
    return getTaskById(id);
}

export async function addTask(title:string){
    return createTask(title);
}

export async function editTask(id:number, updates:Partial<{title:string; completed:boolean}>) {
    return updateTask(id, updates);
}

export async function removeTask(id:number){
    return deleteTask(id);
}

