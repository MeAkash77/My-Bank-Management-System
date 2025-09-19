import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import routes from './app/routes';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

const app: Application = express();
app.use(cookieParser());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allowed frontend origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://my-bank-management-system-frontent-ix668idjc-akash-d5052c73.vercel.app',
  'https://my-bank-bank-management-system-fron.vercel.app',
  'https://my-bank-management-system-frontent.vercel.app',
];

// Express CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// API routes
app.use('/api/v1', routes);

// 👇 Add a root route so visiting / shows something
app.get('/', (req: Request, res: Response) => {
  res.send('Backend is running 🚀');
});

// Global error handler
app.use(globalErrorHandler);

// Handle 404 Not Found
app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
});

export default app;
