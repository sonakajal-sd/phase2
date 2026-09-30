"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTickets = getAllTickets;
exports.getTicketById = getTicketById;
exports.createTicket = createTicket;
exports.updateTicketStatus = updateTicketStatus;
exports.updateTicketAssignee = updateTicketAssignee;
exports.deleteTicket = deleteTicket;
const connection_1 = __importDefault(require("../db/connection"));
async function getAllTickets() {
    const result = await connection_1.default.query(`SELECT * FROM tickets ORDER BY id`);
    return result.rows;
}
async function getTicketById(id) {
    const result = await connection_1.default.query(`SELECT * FROM tickets WHERE id=$1`[id]);
    return result.rows[0];
}
async function createTicket(title, description, priority) {
    const result = await connection_1.default.query(`INSERT INTO tickets (title,description, priority)
        VALUES($1,$2,$3) RETURNING *`, [title, description, priority]);
    return result.rows[0];
}
async function updateTicketStatus(id, status) {
    const result = await connection_1.default.query(`UPADTE tickets SET status=$1 WHERE id=$2 RETURNING *
        `, [status, id]);
    return result.rows[0];
}
async function updateTicketAssignee(id, assignee) {
    const result = await connection_1.default.query(`UPDATE tickets SET assignee=$1 WHERE id=$2 RETURNING *`, [assignee, id]);
    return result.rows[0];
}
async function deleteTicket(id) {
    const result = await connection_1.default.query(`DELETE FROM tickets WHERE id=$1 RETURNING*`[id]);
    return result.rows[0];
}
