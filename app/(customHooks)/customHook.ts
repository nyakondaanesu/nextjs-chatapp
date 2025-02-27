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
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log(`user ${newSocket.id} has connected`);
    });

    if (googleUserId && googleProfilePic) {
      newSocket.emit("authenticate", { googleUserId, googleProfilePic });
      newSocket.emit("authenticateVideo", { googleUserId });
    } else {
      console.error("Session data is missing for authentication!");
    }

    return () => {
      newSocket.close();
    };
  }, [googleProfilePic, googleUserId]);

  return { socket, googleUserId, googleProfilePic };
};

export default useSocket;
