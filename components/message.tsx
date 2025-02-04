"use client";
import { MouseEvent, useEffect, useState } from "react";
import { getSocketInstance } from "../lib/socketInstance";
import { getUserIdInstance } from "../lib/socketInstance";

export default function Messages() {
  const socket = getSocketInstance();
  const userID = getUserIdInstance();
  type message = {
    fromId: string | null;
    actualMessage: string;
    timStamp?: string;
  };

  const [inputValue, setInputValue] = useState("");
  const [messageReceived, setMessageReceived] = useState<message[]>([]);

  //sending the message to the server
  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const time = new Date();
    const payload: message = {
      fromId: userID,
      actualMessage: inputValue,
      timStamp: `${time.getHours()}:${time.getMinutes()}`,
    };

    setMessageReceived((prevMessages) => [...prevMessages, payload]);

    // Emit the message to the server
    socket?.emit("sendPrivateMessage", payload);
    setInputValue("");
  };

  useEffect(() => {
    // Handle received messages
    socket?.on("receivePrivateMessage", (dataMessage: message) => {
      setMessageReceived((prevMessages) => [...prevMessages, dataMessage]);
    });

    return () => {
      socket?.off("sendPrivateMessage");
      socket?.off("receivePrivateMessage");
    };
  }, [socket]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      {/* Message container takes up full height, with scrolling */}
      <div className=" flex-col h-[calc(100vh-16rem)] overflow-y-auto space-y-8 ">
        {messageReceived?.map((message, index) => {
          return (
            <div
              key={index}
              className={`${
                message.fromId === userID
                  ? "flex justify-end "
                  : "flex justify-start "
              }`}
            >
              <div className="flex text-wrap items-center">
                <p
                  className={`${
                    message.fromId === userID
                      ? "bg-blue-500 text-white"
                      : "bg-green-500 text-white"
                  } rounded-lg p-2 text-lg mx-10 max-w-prose`}
                >
                  {message.actualMessage}
                  <span className="text-xs ml-12">{message.timStamp}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input field and send button stay at the bottom */}
      <div className="flex items-center p-4 ">
        <input
          className="rounded-lg text-black flex-1 p-2 border border-gray-300"
          placeholder="Type your message here"
          onChange={handleChange}
          value={inputValue}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white mx-2 px-6 py-2 flex rounded-lg"
        >
          Send
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </div>
    </>
  );
}
