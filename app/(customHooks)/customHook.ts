"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { useSession } from "next-auth/react";
const useSocket = () => {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);

  const { data: session } = useSession();
  const googleUserId = session?.user?.email;

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

    newSocket.emit("authenticate", googleUserId);

    // Cleanup on component unmount
    return () => {
      newSocket.close();
    };
  }, []);

  return { socket, googleUserId };
};

export default useSocket;
