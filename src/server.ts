import http from 'http';
import { Server } from 'socket.io';
import app from './app';

const allowedOrigins = [
  'http://localhost:3000',
  'https://my-bank-bank-management-system-fron.vercel.app',
  'https://my-bank-management-system-frontent.vercel.app',
];

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Attach Socket.IO to Express app so routes can use it
app.set('socketio', io);

// 🔑 Export for Vercel serverless function
export default server;

// 🔑 Run locally (only when not in Vercel)
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}
