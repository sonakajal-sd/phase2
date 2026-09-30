import pool from "../db/connection";

export async function getAllTickets(){
    const result= await pool.query(
        `SELECT * FROM tickets ORDER BY id`
    );
    return result.rows;
}

export async function getTicketById(id:number){
    const result= await pool.query(
        `SELECT * FROM tickets WHERE id=$1`,
        [id]
    );
    return result.rows[0];
}

 export async function createTicket(title:string, description:string, priority:string){
    const result= await pool.query(
        `INSERT INTO tickets (title,description, priority)
        VALUES($1,$2,$3) RETURNING *`,
        [title,description,priority]
    );
    return result.rows[0];
}

export async function updateTicketStatus(id:number, status:string) {
    const result=await pool.query(
        `UPDATE tickets SET status=$1 WHERE id=$2 RETURNING *
        `,[status,id]
    );
    return result.rows[0];
}

export async function updateTicketAssignee(id:number, assignee:string){
    const result= await pool.query(
        `UPDATE tickets SET assignee=$1 WHERE id=$2 RETURNING *`,[assignee, id]
    );
    return result.rows[0];
}

export async function deleteTicket(id:number){
    const result= await pool.query(
        `DELETE FROM tickets WHERE id=$1 RETURNING*`,[id]
    );
    return result.rows[0];
}