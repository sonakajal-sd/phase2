const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch<T>(endpoint:string):Promise<T>{
  const respone= await fetch (`${API_URL}${endpoint}`);

  if(!respone.ok){
    throw new Error("Failed to fetch data");
  }

  return respone.json() as Promise<T>;
}