import { error } from "node:console";
import { getAllTickets,getOneTicket,addTicket,updateTicketStatus,updateTicketAssigneeService,deleteTicketService ,assignTicketService} from "../services/ticketService.js";
import type { Request, Response, NextFunction, response } from "express";


export const getTicketsContoller=async(req:Request, res:Response)=>{
    const tickets= await getAllTickets();
    return res.json(tickets);
}

export const getSingleTicketController= async (req:Request, res:Response)=>{
     const id= Number(req.params.id);
    const ticket= await getOneTicket(id);
    
    if(!id){
        res.status(404).json({
            error:"Invlid id "
        })
    }
    return res.json(ticket);
}

export const createTicketController=async(req:Request, res:Response)=>{
    const {title, description}= req.body;
    const ticket=  await addTicket(title, description);

    return res.status(201).json(ticket);
}

export const updateTicketStatusController=async(req:Request, res:Response)=>{
    const {status}= req.body;
    const id= Number(req.params.id);
    const ticket= await updateTicketStatus(id , status);

    return res.status(200).json(ticket);
}

export const updateTicketAssigneeController=async(req:Request, res:Response)=>{
    const {assignee}=req.body;
        const id= Number(req.params.id);
        const ticket= await updateTicketAssigneeService(id, assignee);

    return res.status(200).json(ticket);

}

export const deleteTicketServiceController= async(req:Request, res:Response)=>{
           const id= Number(req.params.id);
           const ticket= await deleteTicketService(id);
           console.log("Task deleted Successfully");
           return res.status(204).json(ticket);

}
  

export const assignTicketController = async (
  req: Request,
  res: Response
) => {

  const id = Number(req.params.id);
  const { assignee } = req.body;

  const ticket = await assignTicketService(id, assignee);

  if (!ticket) {
    return res.status(404).json({
      error: "Ticket not found"
    });
  }

  return res.status(200).json(ticket);
};
