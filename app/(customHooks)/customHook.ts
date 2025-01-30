"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  const [userID, setUserId] = useState("");
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  // const [usersConnected, setUsersConnected] = use

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      setUserId(newSocket.id as string);
      console.log(`user ${newSocket.id} has connected`);
    });

    // Cleanup on component unmount
    return () => {
      newSocket.close();
    };
  }, []);

  return { socket, userID };
};

export default useSocket;
