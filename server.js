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
    let users = {};

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
      socket.on("authenticate", (googleUserId) => {
        console.log(`Authenticating user with Google ID: ${googleUserId}`);
        queuedUsers.push(users[googleUserId]);
        // If the user already has a socketId, remove the old one
        if (users[googleUserId]) {
          console.log(`Removing old socketId for user: ${googleUserId}`);
          io.sockets.sockets.get(users[googleUserId])?.disconnect();
          queuedUsers = queuedUsers.filter((id) => id !== users[googleUserId]);

          // remove private room if user is in one
        }

        // Save the new socketId for this user
        users[googleUserId] = socket.id;
        console.log(users);
      });

      console.log(`${socket.id} has connected`);

      //check if user has a session

      console.log(queuedUsers);

      //joining a private chat room
      socket.on("joinPrivateChat", (googleUserId) => {
        const createPrivateRoom = () => {
          const privateRoom = new room(generateUniqueId());
          const key = users[googleUserId];
          console.log(`your key is ${key}`);
          privateRoom.addItem(key);
          privateRooms.push(privateRoom);
          socket.join(privateRoom.id);
          console.log(
            `${socket.id} has created private chat$ room and joined that room too ${privateRoom.id}`
          );
        };

        const availableRoom = privateRooms.find(
          (room) =>
            room.users.length === 1 && room.users[0] != users[googleUserId]
        );

        if (availableRoom) {
          availableRoom.addItem(users[googleUserId]);
          socket.join(availableRoom.id);
          io.to(availableRoom.id).emit("matchFound");
          console.log(
            `${users[googleUserId]} joined existing private room: ${availableRoom.id}`
          );
        } else {
          // Create a new private room
          createPrivateRoom();
        }
      });

      //sending a message to a private chat room
      socket.on("sendPrivateMessage", (data) => {
        const userRoom = privateRooms.find((room) =>
          room.users.includes(socket.id)
        );

        if (userRoom) {
          console.log(
            `${socket.id} sent a message to room ${userRoom.id}: ${data.actualMessage}`
          );
          socket.to(userRoom.id).emit("receivePrivateMessage", data);
        } else {
          console.error(`User ${socket.id} is not in any room.`);
        }
      });

      socket.on("disconnect", () => {
        console.log(`client ${socket.id} disconnected`);
        queuedUsers = queuedUsers.filter((item) => item != socket.id);

        privateRooms = privateRooms.filter((room) => {
          const userIndex = room.users.indexOf(socket.id);

          if (userIndex !== -1) {
            // If the user is in this room, remove them
            room.users.splice(userIndex, 1);

            // If the room has no users left, remove the room from privateRooms
            if (room.users.length === 0) {
              console.log(`Room ${room.id} is empty and will be removed`);
              return false; // Remove the room
            }
          }

          // Keep the room if the user is not in it
          return true;
        });
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
