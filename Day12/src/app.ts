import express from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./middleware/logger.js";
import ticketRoutes from "./routes/ticketRoutes.js";

export const app = express();

app.use(express.json());
app.use(logger);

app.use("/tickets", ticketRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});
app.use(errorHandler);
