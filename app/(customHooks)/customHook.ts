"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { useSession } from "next-auth/react";
const useSocket = () => {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);

  const { data: session } = useSession();
  const googleUserId = session?.user?.email;
  const googleProfilePic = session?.user?.image;

  useEffect(() => {
    const newSocket = io("wss://websocket-server-oya2.onrender.com", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log(`user ${newSocket.id} has connected`);
    });

    newSocket.emit("authenticate", { googleUserId, googleProfilePic });

    // Cleanup on component unmount
    return () => {
      newSocket.close();
    };
  }, [googleProfilePic, googleUserId, socket]);

  return { socket, googleUserId, googleProfilePic };
};

export default useSocket;
