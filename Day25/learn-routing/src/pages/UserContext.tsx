import { createContext } from "react";

type User={
    name:string;
    role:string
}

export const UserContext= createContext<User>({
    name:"Satiya",
    role:"Friend"
})