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
      <div className="flex flex-col h-[calc(100vh-12rem)] w-full overflow-y-auto space-y-6 ">
        {messageReceived?.map((message, index) => {
          return (
            <div
              key={message.actualMessage + index}
              className={`${
                message.fromId === userID
                  ? "flex justify-end w-full"
                  : "flex justify-start w-full"
              }`}
            >
              <div className="flex space-x-4 items-center">
                <p
                  className={`${
                    message.fromId === userID
                      ? "bg-blue-500 text-white"
                      : "bg-green-500 text-white"
                  } rounded-lg p-2 text-lg max-w-[80%]`}
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
          className="bg-blue-500 text-white mx-2 px-6 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </>
  );
}
