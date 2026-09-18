import type { Task } from "../types/task.js";
export declare function addTask(title: string): Promise<Task>;
export declare function listTasks(): Promise<Task[]>;
export declare function completeTask(id: number): Promise<Task>;
export declare function deleteTask(id: number): Promise<void>;
export declare function filterTasks(completed: boolean): Promise<Task[]>;
//# sourceMappingURL=taskService.d.ts.map