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
    class room {
      constructor(RoomId) {
        this.id = RoomId;
        this.users = [];
      }
      addItem(item) {
        if (typeof item === "string" && this.users.length < 2) {
          this.users.push(item);
        }
      }

      getItems() {
        return this.users.length;
      }
    }
    // generate a unique ID for each user
    const generateUniqueId = () => {
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substring(2, 8);
      return `${timestamp}-${randomStr}`;
    };

    let queuedUsers = [];
    let privateRooms = [];
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
      console.log(`${socket.id} has connected`);
      queuedUsers.push(socket.id);
      console.log(queuedUsers);

      socket.on("message", (data) => {
        // Handle incoming messages
        socket.emit("message", data); // Broadcast to all clients
      });

      socket.on("hello", (dataMessage) => {
        socket.broadcast.emit("hello", dataMessage);
      });

      //joining a private chat room
      socket.on("joinPrivateChat", () => {
        const createPrivateRoom = () => {
          const privateRoom = new room(generateUniqueId());

          if (privateRoom.getItems() === 2) {
            //  2 users have joined the private room, create a new private room
            console.log(`${privateRoom.id} is full`);
          } else {
            privateRoom.addItem(socket.id);
            privateRooms.push(privateRoom);
            socket.join(privateRoom);
            console.log(
              `${socket.id} has created private chat room ${privateRoom.id}`
            );
          }
        };

        //check do we have a private room in the privateRooms array
        if (privateRooms.length > 0) {
          //if we do add the user to the private room

          const privateRoom = privateRooms[0];

          //check if the private room is full
          if (privateRoom.getItems() === 2) {
            //if the private room is full, create a new private room
            console.log(`${privateRoom.id} is full`);
            createPrivateRoom();
          } else {
            //if
            privateRoom.addItem(socket.id);
            console.log(
              ` this ${socket.id}  has joined private chat room ${privateRoom.id}`
            );
          }
        } else {
          //if we dont have a private room create one
          createPrivateRoom();
        }

        //if we dont have a private room create one
      });

      socket.on("disconnect", () => {
        console.log(`client ${socket.id} disconnected`);
        queuedUsers = queuedUsers.filter((item) => item != socket.id);
        console.log(queuedUsers);
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
