const API_URL= "http://localhost:3000/api";

export async function apiFetch<T>(endpoint:string, signal?:AbortSignal):Promise<T>{
    const response = await fetch(`${API_URL}${endpoint}`,{signal});

    if(!response.ok){
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
}
