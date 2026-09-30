import { getAllTickets,getOneTicket,addTicket,updateTicketStatus,updateTicketAssigneeService,deleteTicketService ,assignTicketService} from "../services/ticketService.js";
import type { Request, Response } from "express";


export const getTicketsContoller=async(req:Request, res:Response)=>{
    const tickets= await getAllTickets();
    return res.json(tickets);
}

export const getSingleTicketController= async (req:Request, res:Response)=>{
    const id= Number(req.params.id);
    if(!Number.isInteger(id) || id<=0){
        return res.status(400).json({
            error:"Invalid id"
        });
    }

    const ticket= await getOneTicket(id);
    if(!ticket){
        return res.status(404).json({
            error:"Ticket not found"
        });
    }
    return res.json(ticket);
}

export const createTicketController=async(req:Request, res:Response)=>{
    const {title, description, priority}= req.body ?? {};
    if(!title || !description){
        return res.status(400).json({
            error:"title and description are required"
        });
    }
    const ticket=  await addTicket(title, description, priority);

    return res.status(201).json(ticket);
}

export const updateTicketStatusController=async(req:Request, res:Response)=>{
    const {status}= req.body ?? {};
    const id= Number(req.params.id);
    if(!status){
        return res.status(400).json({
            error:"status is required"
        });
    }
    const ticket= await updateTicketStatus(id , status);
    if(!ticket){
        return res.status(404).json({
            error:"Ticket not found"
        });
    }

    return res.status(200).json(ticket);
}

export const updateTicketAssigneeController=async(req:Request, res:Response)=>{
    const {assignee}=req.body ?? {};
    const id= Number(req.params.id);
    if(!assignee){
        return res.status(400).json({
            error:"assignee is required"
        });
    }
    const ticket= await updateTicketAssigneeService(id, assignee);
    if(!ticket){
        return res.status(404).json({
            error:"Ticket not found"
        });
    }

    return res.status(200).json(ticket);

}

export const deleteTicketServiceController= async(req:Request, res:Response)=>{
    const id= Number(req.params.id);
    const ticket= await deleteTicketService(id);
    if(!ticket){
        return res.status(404).json({
            error:"Ticket not found"
        });
    }
    console.log("Task deleted Successfully");
    return res.status(204).send();

}


export const assignTicketController = async (
  req: Request,
  res: Response
) => {

  const id = Number(req.params.id);
  const { assignee } = req.body ?? {};

  const ticket = await assignTicketService(id, assignee);

  if (!ticket) {
    return res.status(404).json({
      error: "Ticket not found"
    });
  }

  return res.status(200).json(ticket);
};
