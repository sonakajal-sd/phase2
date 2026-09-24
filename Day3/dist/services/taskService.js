import { getTasks, getTasksById } from "../repositories/taskRepository.js";
export async function getAllTasks() {
    return await getTasks();
}
export async function getTask(id) {
    return await getTasksById(id);
}
//# sourceMappingURL=taskService.js.map