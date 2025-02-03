"use client";
import Image from "next/image";
import useSocket from "../(customHooks)/customHook";
import { useEffect, useState } from "react";
import Link from "next/link";

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
    <section className="flex mt-10 h-[calc(100vh-100px)]">
      <div className=" bg-accent">
        <nav className="flex justify-center space-x-6 items-center bg-white font-whi">
          <span className="px-5  py-2 text-black ">
            <Link href={"/chat"}>Chat</Link>
          </span>
          <span className="px-5 py-2 text-white font-bold bg-accent ">
            <Link href={"/video"}>video</Link>
          </span>
          <span className="px-5 py-2 text-black">
            <Link href={"/space"}>space</Link>
          </span>
        </nav>
      </div>
      <div className="flex w-full justify-center items-center bg-primary">
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
  );
};

export default Chat;
