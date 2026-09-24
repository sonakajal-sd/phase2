import { readFile,writeFile } from "node:fs/promises";
import { getAllTickets } from "../services/ticketService.js";

export type Ticket = {
  id: number;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "Opened" | "In-Progress" | "Closed";
  assignee: string | null;
};

export async function getTickets(): Promise<Ticket[]> {
  const tickets = await readFile("data/ticket.json", "utf-8");

  return JSON.parse(tickets) as Ticket[];
}


export async function getSingleTicket(id:number):Promise<Ticket|undefined>{
    const tickets= await getTickets();
    if(!tickets){
        return undefined;
    }
    return tickets.find((ticket)=>ticket.id === id);
}

export async function createTicket(title:string,description:string):Promise<Ticket[]>{
   const tickets= await getTickets();
   
   const newTicket:Ticket={
    id:tickets.length+1,
    title,
    description,
    priority:"low",
    status:"Closed",
    assignee:null
   }

   tickets.push(newTicket);
   await writeFile("data/ticket.json",JSON.stringify(tickets,null,2));
   return tickets;
}


export async function updateTicket(id:number, status:Ticket["status"]):Promise<Ticket|undefined>{
    const tickets= await getAllTickets();
    
    const ticket= tickets.find((tick)=>tick.id === id);

    if(!ticket){
        return undefined
    }
    ticket.status= status;
    await writeFile("data/ticket.json", JSON.stringify(tickets,null,2));
    return ticket;
}

export async function updateTicketAssignee(id:number, assignee:Ticket["assignee"]):Promise<Ticket|undefined>{
    const tickets= await getAllTickets();

    const ticket=tickets.find((tick)=>tick.id === id);

    if(!ticket){
        return undefined;
    }
    ticket.assignee= assignee;
    await writeFile("data/ticket.json", JSON.stringify(tickets, null, 2));
    return ticket;
}


export async function deleteTickets(id:number):Promise<Ticket[]|undefined> {
    const tickets= await getAllTickets();

    const ticket= tickets.findIndex((tick)=>tick.id === id);

    if(ticket===-1){
        return undefined;
    }

    tickets.splice(ticket,1);

    await writeFile("data/ticket.json", JSON.stringify(tickets,null,2));

    return tickets;

}

export async function assignTicket(
  id: number,
  assignee: string
): Promise<Ticket | undefined> {

  const tickets = await getAllTickets();

  const ticket = tickets.find((ticket) => ticket.id === id);

  if (!ticket) {
    return undefined;
  }

  ticket.assignee = assignee;

  await writeFile(
    "data/ticket.json",
    JSON.stringify(tickets, null, 2)
  );

  return ticket;
}
