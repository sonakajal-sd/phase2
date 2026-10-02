import express from "express";
import ticketRouter from "./routes/tickets.js";

const app= express();
app.use(express.json());

app.get("/", (_req, res)=>{
    res.json({message:"Day13 API is Running"});
});

app.use("/tickets",ticketRouter);

app.listen(3000, ()=>{
    console.log("Server is running on Port 3000");
});