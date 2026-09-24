import { getTickets ,getSingleTicket,createTicket,updateTicket,updateTicketAssignee, deleteTickets,assignTicket} from "../repositories/ticketRepo.js";

import type { Ticket } from "../repositories/ticketRepo.js";

export async function getAllTickets(){
    return getTickets();
}

export async function getOneTicket(id:number){
    return getSingleTicket(id);
}

export async function addTicket(title:string, description:string){
    return createTicket(title,description);
}
export async function updateTicketStatus(id:number, status:Ticket["status"]) {
 return updateTicket(id, status);
}

export async function updateTicketAssigneeService(id:number, assignee:Ticket["assignee"]) {
    return updateTicketAssignee(id,assignee );
}

export async function deleteTicketService(id:number){
    return deleteTickets(id);
}

export async function assignTicketService(id:number, assignee:string){
    return assignTicket(id, assignee);
}