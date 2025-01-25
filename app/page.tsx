"use client";
import { useEffect, useId, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const [userID, setUserId] = useState("");
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    setSocket(newSocket as any);

    newSocket.on("connect", () => {
      setUserId(newSocket.id as string);
      console.log(`user ${newSocket.id} has connected`);
    });

    // Cleanup on component unmount
    return () => {
      newSocket.close();
    };
  }, []);
  const handleSubmit = (e: { preventDefault: any }) => {
    e.preventDefault();
    socket?.emit("hello", inputValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  return (
    <>
      {" "}
      this is my {userID}
      <input
        placeholder="type message here"
        onChange={handleChange}
        value={inputValue}
      />
      <button onClick={handleSubmit}>send</button>
    </>
  );
}
