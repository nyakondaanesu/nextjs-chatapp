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
      <>
        <div className="flex-col flex h-[calc(100vh-16rem)] overflow-y-auto space-y-8 px-4">
          {messageReceived?.map((message, index) => {
            const isSentByUser = message.fromId === userID;

            return (
              <div
                key={index}
                className={`flex ${
                  isSentByUser ? "justify-end" : "justify-start"
                } w-full`}
              >
                <div
                  className={`flex flex-col ${
                    isSentByUser ? "items-end" : "items-start"
                  } max-w-[60%]`}
                >
                  <div
                    className={`
                  rounded-lg p-3 
                  ${
                    isSentByUser
                      ? "bg-blue-500 text-white rounded-tr-none"
                      : "bg-gray-200 text-gray-800 rounded-tl-none"
                  }
                `}
                  >
                    <p className="break-words">{message.actualMessage}</p>
                    <span className="text-xs mt-1 block opacity-70">
                      {message.timStamp}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center p-4 gap-2">
          <input
            className="rounded-lg text-black flex-1 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message here"
            onChange={handleChange}
            value={inputValue}
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
          >
            Send
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
      </>
    </>
  );
}
