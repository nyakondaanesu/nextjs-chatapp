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
    class Room {
      constructor(RoomId) {
        this.id = RoomId;
        this.users = [];
      }

      addUser(userId) {
        if (this.users.length < 2) {
          this.users.push(userId);
          return true;
        }
        return false;
      }

      removeUser(userId) {
        this.users = this.users.filter((user) => user !== userId);
      }

      isEmpty() {
        return this.users.length === 0;
      }
    }

    const generateUniqueId = () => {
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substring(2, 8);
      return `${timestamp}-${randomStr}`;
    };

    let privateRooms = [];
    let users = {}; // Maps Google User ID to Socket ID
    let profilePics = {};

    await app.prepare();
    const server = express();
    const httpServer = createServer(server);
    const io = new Server(httpServer, {
      cors: {
        origin: dev ? "http://localhost:3000" : "your-production-domain.com",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      socket.on("authenticate", ({ googleUserId, googleProfilePic }) => {
        console.log(`Authenticating user with Google ID: ${googleUserId}`);

        if (users[googleUserId]) {
          const oldSocketId = users[googleUserId];
          io.sockets.sockets.get(oldSocketId)?.disconnect();
          privateRooms = privateRooms.filter((room) => {
            room.removeUser(oldSocketId);
            return !room.isEmpty();
          });
        }

        users[googleUserId] = socket.id;
        profilePics[socket.id] = googleProfilePic;
        console.log(
          `User ${googleUserId} is now authenticated with socket ${socket.id}`
        );
      });

      socket.on("joinPrivateChat", (googleUserId) => {
        let availableRoom = privateRooms.find(
          (room) => room.users.length === 1
        );

        if (availableRoom && availableRoom.addUser(socket.id)) {
          socket.join(availableRoom.id);

          io.to(availableRoom.id).emit("matchFound", {
            thisUser: {
              id: availableRoom.users[0],
              username: Object.entries(users).find(
                ([key, value]) => value === availableRoom.users[0]
              )?.[0],
              image: profilePics[availableRoom.users[0]],
            },
            otherUser: {
              id: availableRoom.users[1],
              username: Object.entries(users).find(
                ([key, value]) => value === availableRoom.users[1]
              )?.[0],
              image: profilePics[availableRoom.users[1]],
            },
          });
          console.log(
            `${googleUserId} joined existing private room: ${availableRoom.id}`
          );
        } else {
          const newRoom = new Room(generateUniqueId());
          newRoom.addUser(socket.id);
          privateRooms.push(newRoom);
          socket.join(newRoom.id);
          console.log(
            `${googleUserId} created and joined new private room: ${newRoom.id}`
          );
        }
      });

      socket.on("sendPrivateMessage", (data) => {
        const userRoom = privateRooms.find((room) =>
          room.users.includes(socket.id)
        );

        if (userRoom) {
          console.log(
            `Message sent in room ${userRoom.id}: ${data.actualMessage}`
          );

          // Emit message to all users in the room *except* the sender
          socket.to(userRoom.id).emit("receivePrivateMessage", data);
        }
      });

      socket.on("disconnect", () => {
        console.log(`Client ${socket.id} disconnected`);
        privateRooms = privateRooms.filter((room) => {
          room.removeUser(socket.id);
          return !room.isEmpty();
        });
      });
    });

    server.all("*", (req, res) => handle(req, res));

    httpServer.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
