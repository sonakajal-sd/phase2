import express from "express";
import { errorHandler } from "./middleware/error-handler";
import ticketRoutes from "./routes/ticket.routes";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    message: "API is running",
  });
});

app.use("/tickets", ticketRoutes);

app.use(errorHandler);

export default app;