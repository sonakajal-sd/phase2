import { readFile,writeFile } from "node:fs/promises";

export async function getTasks(){
  const data=  await readFile("data/tasks.json","utf-8");
  return JSON.parse(data);
}

export async function getTasksById(id:number){
    const tasks= await getTasks();
    return tasks.find((task:{id:number})=>task.id ===id);
}

export async function createTask(task:{
    title:string,
    completed:boolean;
}){
  const tasks= await getTasks();

  const newTask={
    id:tasks.length+1,
    ...task
  };

  tasks.push(newTask);

  await writeFile("data/tasks.json", JSON.stringify(tasks, null, 2));

  return newTask;
}

export async function updateTask(
  id:number,
  data:{
    title?: string;
    completed?: boolean;
  }
){
  const tasks= await getTasks();
  const task= tasks.find((task:{id:number})=>task.id ===id);

  if(!task){
    return undefined;
  }
  if(data.title!==undefined){
    task.title =data.title;
  }
  if(data.completed !==undefined){
    task.completed =data.completed;
  }
  await writeFile("data/tasks.json", JSON.stringify(tasks,null,2));
  return task;
}