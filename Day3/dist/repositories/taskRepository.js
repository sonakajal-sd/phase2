import { readFile } from "node:fs/promises";
export async function getTasks() {
    const data = await readFile("data/tasks.json", "utf-8");
    return JSON.parse(data);
}
export async function getTasksById(id) {
    const tasks = await getTasks();
    return tasks.find((task) => task.id === id);
}
//# sourceMappingURL=taskRepository.js.map