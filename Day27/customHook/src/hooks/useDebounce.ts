import { useState,useEffect } from "react";

export function useDebounce<T>(value:T, delay:number):T{
    const [debounceValue, setDebouncedValue]= useState(value);

    useEffect(()=>{
        const timer= setTimeout(()=>{
            setDebouncedValue(value);
        },delay);

        return()=>{
            clearTimeout(timer);
        };
    },[value,delay]);
    return debounceValue;
}