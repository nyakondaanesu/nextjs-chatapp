"use client";
import Image from "next/image";
import useSocket from "../(customHooks)/customHook";
import { useEffect, useState } from "react";
import Link from "next/link";
import AppSideBar from "@/components/appSideBar";

const Chat = () => {
  const { socket, userID } = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [option, setOption] = useState("chat");

  const handleJoinRoom = () => {
    if (socket) {
      setIsLoading(true); // Set loading state to true when matchmaking starts
      socket.emit("joinPrivateChat", socket.id); // Emit event to server
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("matchFound", () => {
        setIsLoading(false); // Stop loading when match is found
        console.log("Match found!");
        setIsMatched(true); // Set matched state to true
      });

      // Clean up event listener when the component is unmounted or socket changes
      return () => {
        socket.off("matchFound");
      };
    }
  }, [socket]); // Re-run effect if socket changes

  return (
    <>
      <section className="flex ">
        <div className="flex w-full justify-center items-center">
          {!isMatched && (
            <button
              onClick={handleJoinRoom}
              disabled={isLoading} // Disable button while loading
              className="text-black"
            >
              {isLoading ? "Searching for a match..." : "Match Make"}
            </button>
          )}

          {isMatched && (
            <div className="text-center space-y-5">
              <p className="text-black text-3xl ">Match found ! </p>
              <button className="bg-accent text-white rounded-md p-3">
                start a conversation
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Chat;
