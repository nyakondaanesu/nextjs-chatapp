"use client";
import { useEffect, useId, useState } from "react";
import { io } from "socket.io-client";
import useSocket from "./(customHooks)/customHook";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [messageReceived, setMessageReceived] = useState("message here:");
  const { socket, userID } = useSocket();

  const handleSubmit = (e: { preventDefault: any }) => {
    e.preventDefault();
    socket?.emit("hello", inputValue);
  };

  useEffect(() => {
    socket?.on("hello", (dataMessage) => {
      setMessageReceived(dataMessage);
    });
  }, [socket]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  return (
    <>
      {" "}
      this is my {userID}
      <p>{messageReceived}</p>
      <input
        className="rounded-lg text-black mt-10"
        placeholder="type message here"
        onChange={handleChange}
        value={inputValue}
      />
      <button
        onClick={handleSubmit}
        className="bg-green-900 mx-5 px-5 rounded-lg"
      >
        send
      </button>
    </>
  );
}
