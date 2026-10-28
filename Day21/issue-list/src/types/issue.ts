 export type IssueStatus="Open"|"In Progress"|"Done";


 export type IssuePriority= "Low"|"Medium"|"High";



 export type Issue={
    id: number;
    title:string;
    description:string;
    status:IssueStatus;
    priority:IssuePriority;
    dueDate:string;
}