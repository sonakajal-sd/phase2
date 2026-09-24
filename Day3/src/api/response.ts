import { createServer, ServerResponse } from "node:http";

export function sendResponse(
    res:ServerResponse,
    statusCode:number,
    data:unknown
){
    res.statusCode=statusCode;
    res.setHeader("Content-Type","application/json");
    res.end(JSON.stringify(data));
}