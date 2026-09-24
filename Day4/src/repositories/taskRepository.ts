import {readFile, writeFile} from "node:fs/promises";


type Task={
    id:number;
    title:string;
    completed:boolean;
};

export async function getTasks():Promise<Task[]>{
    const data = await readFile("data/tasks.json","utf-8");
    return JSON.parse(data) as Task[];
}
export async function getTaskById(id:number):Promise<Task|undefined>{
    const tasks= await getTasks();

    return tasks.find((task:{id:number})=> task.id === id);
}

export async function createTask(title:string):Promise<Task>{
   const tasks= await getTasks();

   const newTask:Task ={
    id:tasks.length +1,
    title,
    completed:false
   };

   tasks.push(newTask);

   await writeFile("data/tasks.json", JSON.stringify(tasks, null, 2));

   return newTask;
}

export async function updateTask(id:number, updates:Partial<Task>):Promise<Task|undefined>{
    const tasks= await getTasks();

    const index= tasks.findIndex((task)=> task.id ===id);

    if(index === -1){
        return undefined;
    }
    const existingTask= tasks[index];
    if(!existingTask){
        return undefined;
    }

    const updateTask:Task={
        ...existingTask,
        ...updates
    };
    tasks[index] =updateTask;

    await writeFile("data/tasks.json", JSON.stringify(tasks,null,2));
    return tasks[index];
}

export async function deleteTask(id:number):Promise<Task|undefined>{
    const tasks= await getTasks();

    const index=tasks.findIndex((task)=>task.id ===id);

    if(index === -1){
        return undefined;
    }
    const [deletedTask]= tasks.splice(index, 1);

    await writeFile("data/tasks.json", JSON.stringify(tasks, null,2));

    return deletedTask;
}