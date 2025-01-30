"use client";
import { MouseEvent, useEffect, useState } from "react";
import useSocket from "./(customHooks)/customHook";

export default function Home() {
  type message = {
    fromId: string;
    actualMessage: string;
    timStamp?: string;
  };

  const [inputValue, setInputValue] = useState("");
  const [messageReceived, setMessageReceived] = useState<message[]>([]);

  const { socket, userID } = useSocket();

  //sending the message to the server
  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const time = new Date();
    const payload: message = {
      fromId: userID,
      actualMessage: inputValue,
      timStamp: `${time.getHours()}: ${time.getMinutes()}`,
    };

    setMessageReceived((prevMessage) => [...prevMessage, payload]); //add to the sent messages array
    socket?.emit("hello", payload);
    setInputValue("");
  };

  // listening to the hello event
  useEffect(() => {
    socket?.on("hello", (dataMessage: message) => {
      setMessageReceived((prevMessages) => [...prevMessages, dataMessage]);
    });

    return () => {
      socket?.off("hello");
    };
  }, [socket]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  return (
    <>
      {" "}
      this is my {userID}
      <section className="flex flex-col">
        <div className="flex flex-col space-y-4">
          {messageReceived?.map((message, index) => {
            return (
              <div
                key={message.actualMessage + index}
                className={`${
                  message.fromId === userID
                    ? "flex justify-end "
                    : "flex justify-start "
                } `}
              >
                <div className="flex space-x-4 items-center">
                  <p
                    className={`${
                      message.fromId === userID ? "bg-green-900" : "bg-blue-900"
                    } text-white rounded-lg p-2 text-lg`}
                  >
                    {message.actualMessage}
                    <span className="text-xs  justify-end">
                      {message.timStamp}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
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
