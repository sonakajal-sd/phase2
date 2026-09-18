// import { readFile, writeFile } from "node:fs/promises";
// import type { Task } from "../types/task.js";
import { readFile, writeFile, mkdir } from "node:fs/promises";
export async function getTasks() {
    try {
        const data = await readFile("data/tasks.json", "utf-8");
        const tasks = JSON.parse(data);
        return tasks;
    }
    catch (error) {
        return [];
    }
}
export async function saveTasks(tasks) {
    const data = JSON.stringify(tasks, null, 2);
    await mkdir("data", { recursive: true });
    await writeFile("data/tasks.json", data, "utf-8");
}
//# sourceMappingURL=taskRepository.js.map