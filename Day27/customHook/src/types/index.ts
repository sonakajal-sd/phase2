export interface Project{
    id:number;
    name:string;
    createdAt:string;
}

export interface Issue{
    id:number;
    title:string;
    status:string;
    projectId:number;
    createdAt:string;
}