import { createTicket, deleteTicket, getAllTickets, getTicketById,updateTicketAssignee,updateTicketStatus } from "./ticketRepo";

async function testRepository(){
    const ticket=await createTicket(
        "Test ticket", "testing PostgreSQL repository","high"
    );
    console.log("Created:",ticket);
    const tickets= await getAllTickets();
    console.log("All tickets:",tickets);

    const ticketById= await getTicketById(1);
    console.log("Ticket by ID:", ticketById);

    const updateStatus= await updateTicketStatus(1,'closed');
    console.log("updated ticket:",updateStatus);

    const updateAssigne = await updateTicketAssignee(1,"Sona");
    console.log("updated ticket assignee:", updateAssigne);

    const deletedTicket= await deleteTicket(10);
    console.log("Deleted Ticket:",deletedTicket);

}
testRepository();