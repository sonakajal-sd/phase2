import { addTask, completeTask, deleteTask, filterTasks, listTasks } from "../services/taskService.js";

const command= process.argv[2]; //add

// node dist/index.js add "Learn Node"
try{

if(command === "add"){
    const title= process.argv[3];

    if(!title){
        console.log("Please provide a task title");
    }
    else{
        const task= await addTask(title)
        console.log(`Task Added: ${task}`);
    }
}
else if(command ==="list"){
      const tasks = await listTasks();

      console.log(tasks);
}
else if(command ==="complete"){
   
    const id= Number(process.argv[3]);

    if(!process.argv[3]){
        console.log("Plesese provide the task ID");
    }
    else{
        const task= await completeTask(id);
        console.log(`Task Completed :${task}`);
    }
}
else if(command === "delete"){
    const id =Number(process.argv[3]);
     if(!process.argv[3]){
        console.log("Enter the correct ID");
     }else{
        await deleteTask(id);
        console.log(`Task deleted`);
     }
}
if (command === "filter") {
  const status = process.argv[3];

  if (!status) {
    console.log("Please provide a filter: completed or pending");
  } else {
    const completed = status === "completed";

    const tasks = await filterTasks(completed);

    console.log(tasks);
  }
}
}
catch(error){
    console.log("Error:",(error as Error).message);
}