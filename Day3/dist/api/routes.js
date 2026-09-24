import { getAllTasks, getTask } from "../services/taskService.js";
import { sendResponse } from "./response.js";
export async function handleRequest(req, res) {
    if (req.method === "GET" && req.url === "/tasks") {
        const tasks = await getAllTasks();
        sendResponse(res, 200, tasks);
        return;
    }
    if (req.method === "GET" && req.url?.startsWith("/tasks/")) {
        const id = Number(req.url.split("/")[2]);
        const task = await getTask(id);
        if (!task) {
            sendResponse(res, 404, { error: "task not found" });
            return;
        }
        sendResponse(res, 200, task);
        return;
    }
}
//# sourceMappingURL=routes.js.map