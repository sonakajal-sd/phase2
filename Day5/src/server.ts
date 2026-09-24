import express from "express";
import ticketRouter from "./routes/ticketRoute.js"
import { logger } from "./middleware/logger.js";

const app= express();
app.use(express.json());
app.use(logger);


app.use("/tickets",ticketRouter);



app.listen(3000, ()=>{
    console.log("Port is running on server 3000");
});