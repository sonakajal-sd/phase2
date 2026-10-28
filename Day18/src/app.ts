import express from "express";
import router from "./routes/ticketRoutes.js";
import authRoute from "./module/auth/auth.route.js";
import userRoute from "./module/me/me.route.js";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "too many request form this ip, please try again after 15 min",
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: "too many authentication attempts, please try again in an hour",
});

app.use(
  express.json({
    limit: "10kb",
  }),
);
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(limiter);

app.use("/tickets", router);
app.use("/auth", authLimiter, authRoute);
app.use("/me", userRoute);

app.use(
  (
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "route not found",
      },
    });
  },
);

export default app;
