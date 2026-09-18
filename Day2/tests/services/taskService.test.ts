import { describe, it , expect,vi, } from "vitest";
import { addTask,listTasks,completeTask,deleteTask,filterTasks } from "../../src/services/taskService.js";

import { getTasks, saveTasks } from "../../src/repository/taskRepository.js";

vi.mock("../../src/repository/taskRepository.js",()=>({
    getTasks:vi.fn(),
    saveTasks:vi.fn(),
}));

describe("Task Service",()=>{
    it("should add a new task",async()=>{
        vi.mocked(getTasks).mockResolvedValue([]);

        const task=await addTask("learn Node");

        expect(task).toEqual({
            id:1,
            title:"learn Node",
            completed:false,
        });
    });

    it("should retrun list all tasks",async()=>{
        const tasks=[
            {
                id:1,
                title:"Learn Node",
                completed:false,
            },
            {
                id:2,
                title:"Practice Typescript",
                completed:true,
            },
        ];

        vi.mocked(getTasks).mockResolvedValue(tasks);
        const result= await listTasks();

        expect(result).toEqual(tasks);
    });

    it("should complete a task",async()=>{
        const tasks=[
            {
                id:1,
                title:"learn Node",
                completed:false,
            },
        ];
        vi.mocked(getTasks).mockResolvedValue(tasks);
        const result=await completeTask(1);
        expect(result.completed).toBe(true);
    });

    it("should throw an error if the task is not found",async()=>{
        vi.mocked(getTasks).mockResolvedValue([]);

        await expect(completeTask(99)).rejects.toThrow("Task not found")
    });

    it("should delete a task", async()=>{
        const tasks=[
            {
                id:1,
                title:"learn Node",
                completed:false,
            },
            {
                id:2,
                title:"learn Typescript",
                completed:false,
            }
        ]
        vi.mocked(getTasks).mockResolvedValue(tasks);
        await deleteTask(1);

        expect(saveTasks).toHaveBeenCalledWith([
            {
                id:2,
                title:"learn Typescript",
                completed:false,
            },
        ]);
    });


    it("should throw an error when deleting a task tht does not exist",async()=>{
        vi.mocked(getTasks).mockResolvedValue([]);

        await expect(deleteTask(99)).rejects.toThrow("Task not found");
    })

    it("filter the completed true tasks",async()=>{
        const tasks=[
            {
                id:1,
                title:"learn Node",
                completed:true,
            },
            {
                id:2,
                title:"Learn typescript",
                completed:false,
            }
        ]
        vi.mocked(getTasks).mockResolvedValue(tasks);
        const result=await filterTasks(true);

        expect(result).toEqual([
            {
                id:1,
                title:"learn Node",
                completed:true
            }
        ]);
    });
});