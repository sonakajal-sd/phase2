import { useEffect } from "react";

export function useDocumentTitle(title:string){
    useEffect(()=>{
        document.title= title;
    },[title]); // update the tab title whenever `title` changes
}
