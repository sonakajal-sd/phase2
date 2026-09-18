import { getTasks, saveTasks } from "../repository/taskRepository.js";
export async function addTask(title) {
    const tasks = await getTasks();
    const newTask = {
        id: tasks.length + 1,
        title: title,
        completed: false,
    };
    tasks.push(newTask);
    await saveTasks(tasks);
    return newTask;
}
export async function listTasks() {
    const tasks = await getTasks();
    return tasks;
}
export async function completeTask(id) {
    const tasks = await getTasks();
    const task = tasks.find((task) => task.id === id);
    if (!task) {
        throw new Error("Task not found");
    }
    task.completed = true;
    await saveTasks(tasks);
    return task;
}
export async function deleteTask(id) {
    const tasks = await getTasks();
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
        throw new Error("Task not found");
    }
    tasks.splice(taskIndex, 1);
    await saveTasks(tasks);
}
export async function filterTasks(completed) {
    const tasks = await getTasks();
    return tasks.filter((task) => task.completed === completed);
}
//# sourceMappingURL=taskService.js.map