import express from "express";
import next from "next";
import { createServer } from "http";
import { Server } from "socket.io";

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const startServer = async () => {
  try {
    await app.prepare();
    const server = express();
    const httpServer = createServer(server);
    const io = new Server(httpServer, {
      cors: {
        origin: dev ? "http://localhost:3000" : "your-production-domain.com",
        methods: ["GET", "POST"],
      },
    });

    // Socket.IO events
    io.on("connection", (socket) => {
      console.log("Client connected");

      socket.on("message", (data) => {
        // Handle incoming messages
        io.emit("message", data); // Broadcast to all clients
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });

    // Your custom routes here
    server.get("/api/custom", (req, res) => {
      res.json({ message: "Custom route" });
    });

    // Handle all other routes with Next.js
    server.all("*", (req, res) => {
      return handle(req, res);
    });

    httpServer.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
