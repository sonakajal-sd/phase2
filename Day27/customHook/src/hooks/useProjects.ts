import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import type { Project } from "../types";

export function useProjects(){
    const[projects, setProjects]=useState<Project[]>([]);
    const[loading, setLoading]=useState(true);
    const[error, setError]=useState("");

    useEffect(()=>{
        // Lets us cancel the request if the component unmounts.
        const controller= new AbortController();

        async function fetchProjects(){
            try{
                const data= await apiFetch<Project[]>("/projects", controller.signal);
                setProjects(data);
            }
            catch(err){
                // We cancelled the request ourselves, so it's not a real error.
                if(err instanceof Error && err.name === "AbortError"){
                    return;
                }
                setError("Failed to load projects");
            }
            finally{
                if(!controller.signal.aborted){
                    setLoading(false);
                }
            }
        }

        fetchProjects();

        // Cleanup: runs when the component unmounts.
        return()=>{
            controller.abort();
        };
    },[]); // [] = fetch only once, when the component first shows up

    return { projects, loading, error };
}
