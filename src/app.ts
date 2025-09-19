import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import routes from "./app/routes";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import http from "http";
import { Server } from "socket.io";

const app: Application = express();
app.use(cookieParser());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://cholti-bank.vercel.app",
  "https://my-bank-bank-management-system-frontend-gp0diebm5.vercel.app", // ✅ add your deployed frontend
];

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Express CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Make Socket.IO available in routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.io = io;
  next();
});

// API routes
app.use("/api/v1", routes);

// Attach the Socket.IO instance to the Express app
app.set("socketio", io);

// Global error handler
app.use(globalErrorHandler);

// Handle 404 Not Found
app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
});

export default server;
