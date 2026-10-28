import type  { Issue } from "../types/issue";

 export const issues :Issue[] =[
    {
        id:1,
        title:"Login Issue",
        description:"Still not corrected the issue",
        status:"Open",
        priority:"Medium",
        dueDate:"2026-10-16"
    },
    {
        id:2,
        title:"Hard Disk Issue",
        description:"Its not Working its lagging a lot",
        status:"In Progress",
        priority:"High",
        dueDate:"2026-10-13"

    },
    {
        id:3,
        title:"Issuing Pendrive",
        description:"The pendrive is still not recieved",
        status:"Done",
        priority:"Low",
        dueDate:"2026-11-14"
    },
    {
        id:4,
        title:"Monitor Issue",
        description:"The Display of the monitor is not working properly",
        status:"In Progress",
        priority:"High",
        dueDate:"2026-12-25"
    }
];