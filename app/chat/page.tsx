"use client";
import Image from "next/image";
import useSocket from "../(customHooks)/customHook";
import { useEffect, useState } from "react";

const Chat = () => {
  const { socket, userID } = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [isMatched, setIsMatched] = useState(false);

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
    <section className="mt-10 flex mx-5 h-[calc(100vh-128px)]">
      <div className="bg-accent w-1/4">side panel</div>
      <div>
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
          <p className="text-black">You are matched! Room ID: {socket?.id}</p>
        )}
      </div>
    </section>
  );
};

export default Chat;
