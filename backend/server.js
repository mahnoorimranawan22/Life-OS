import http from 'node:http';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';

import env from './config/env.js';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/index.js';
import { notFoundHandler } from './middleware/not-found.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

app.disable('x-powered-by');
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const server = http.createServer(app);

// Socket.IO is wired up now (no features yet) — ready for real-time phases.
const io = new Server(server, {
  cors: { origin: env.clientUrl, credentials: true },
});

const start = async () => {
  await connectDB();
  server.listen(env.port, () => {
    console.log(`LifeOS API listening on http://localhost:${env.port}`);
  });
};

start().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});

export { app, server, io };