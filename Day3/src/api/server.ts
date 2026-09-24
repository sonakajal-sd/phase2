import { createServer } from "node:http";
import { handleRequest } from "./routes.js";

const server= createServer(handleRequest);
server.listen(3000,()=>{
    console.log("server running on http://localhost:3000")
});