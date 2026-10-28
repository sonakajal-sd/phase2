import { useState, useEffect } from "react";
import { apiFetch } from "../api/client";
import type { Issue } from "../types";

export function useIssue(id:number){
    const[issue, setIssue]=useState<Issue | null>(null);
    const[loading, setLoading]=useState(true);
    const[error, setError]=useState("");

    useEffect(()=>{
        const controller= new AbortController();

        async function fetchIssue(){
            setLoading(true);
            setError("");

            try{
                const data= await apiFetch<Issue>(`/issues/${id}`, controller.signal);
                setIssue(data);
            }
            catch(err){
                if(err instanceof Error && err.name === "AbortError"){
                    return;
                }
                setError("Failed to load issue");
            }
            finally{
                if(!controller.signal.aborted){
                    setLoading(false);
                }
            }
        }

        fetchIssue();

        return()=>{
            controller.abort();
        };
    },[id]); // fetch again whenever the id changes

    return { issue, loading, error };
}
