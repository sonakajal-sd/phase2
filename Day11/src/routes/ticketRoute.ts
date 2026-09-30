import express  from "express";
import { getTicketsContoller ,getSingleTicketController,createTicketController,updateTicketStatusController,updateTicketAssigneeController,deleteTicketServiceController} from "../controllers/ticketCntrl.js";

const route= express.Router();

route.get("/",getTicketsContoller);
route.get("/:id",getSingleTicketController);
route.post("/",createTicketController);
route.patch("/:id/status",updateTicketStatusController);
route.patch("/:id/assignee",updateTicketAssigneeController);
route.delete("/:id",deleteTicketServiceController);


export default route;