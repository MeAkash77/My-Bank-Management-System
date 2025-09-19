import http from 'http';
import { Server } from 'socket.io';
import app from '../src/app';

// Create HTTP server
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:3000',
  'https://my-bank-bank-management-system-fron.vercel.app',
  'https://my-bank-bank-management-system-frontend-gp0diebm5.vercel.app',
];

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Attach Socket.IO to Express app
app.set('socketio', io);

// Export default for Vercel
export default (req: any, res: any) => {
  // Let Express handle the request/response
  return app(req, res);
};
