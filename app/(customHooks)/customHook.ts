"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);

  // const [usersConnected, setUsersConnected] = use

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log(`user ${newSocket.id} has connected`);
    });

    // Cleanup on component unmount
    return () => {
      newSocket.close();
    };
  }, []);

  return { socket };
};

export default useSocket;
