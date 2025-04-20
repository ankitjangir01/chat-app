import express from 'express';
import { Server } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import cors from 'cors';

const app = express();

app.use(cors());

// Set up basic route
app.get('/', (req, res) => {
  res.send('Hello, this is the Express server!');
});

// Create HTTP server for Express
const server: Server = app.listen(3000, () => {
  console.log('Server running on port 3000');
});

const wss = new WebSocketServer({ server });
// Initialize WebSocket server
wss.on('connection', (ws: WebSocket) => {
  console.log('A client connected');
  ws.on('message', (data: WebSocket.RawData) => {
    const message = typeof data === 'string' ? data : data.toString();
    console.log(`Received message: ${message}`);
    // Broadcast the message to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

export default app;
