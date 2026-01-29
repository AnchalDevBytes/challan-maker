import express from "express";
import type { Application, NextFunction, Request, Response } from 'express';
import routes from "./routes";
import cookieParser from "cookie-parser";
import cors from "cors";

const app : Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Server is healthy and running!");
});

app.use('/api', routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const status = err.status || 'error';

  res.status(statusCode).json({
    status: status,
    message: message
  })
});

export default app;
