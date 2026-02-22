import express from "express";
import type { Application, NextFunction, Request, Response } from "express";
import routes from "./routes";
import cookieParser from "cookie-parser";
import cors from "cors";

const app: Application = express();

const allowedOrigin = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === allowedOrigin) {
        callback(null, true);
      } else {
        console.log("Rejected Origin by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options("/*splat", cors());

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is healthy and running!");
});

app.use("/api", routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const status = err.status || "error";

  res.status(statusCode).json({
    status: status,
    message: message,
  });
});

export default app;
