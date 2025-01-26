"use client";
import { MouseEvent, useEffect, useState } from "react";
import useSocket from "./(customHooks)/customHook";

export default function Home() {
  type message = {
    fromId: string;
    actualMessage: string;
  };

  const [inputValue, setInputValue] = useState("");
  const [messageReceived, setMessageReceived] = useState<message[]>([]);

  const { socket, userID } = useSocket();

  //sending the message to the server
  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const payload: message = {
      fromId: userID,
      actualMessage: inputValue,
    };

    socket?.emit("hello", payload);
    setInputValue("");
  };

  // listening to the hello event
  useEffect(() => {
    socket?.on("hello", (dataMessage: message) => {
      setMessageReceived((prevMessages) => [...prevMessages, dataMessage]);
    });
  }, [socket]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  return (
    <>
      {" "}
      this is my {userID}
      <section className="flex">
        <div className="">
          {messageReceived?.map((message) => {
            return (
              <p
                key={message.actualMessage}
                className="bg-blue-900 rounded-md mt-5"
              >
                {message.actualMessage}
              </p>
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
