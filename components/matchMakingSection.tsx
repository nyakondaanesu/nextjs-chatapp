"use client";

import useSocket from "@/app/(customHooks)/customHook";
import { setSocketInstance } from "../lib/socketInstance";
import { setUserIdInstance } from "../lib/socketInstance";
import React, { useEffect, useState } from "react";
import Loader from "./cluter";

const MatchMakingSection = ({ children }: { children: React.ReactNode }) => {
  const { socket } = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [isMatched, setIsMatched] = useState(false);

  const handleJoinRoom = () => {
    if (socket) {
      setIsLoading(true); // Set loading state to true when matchmaking starts
      socket.emit("joinPrivateChat", socket.id); // Emit event to server
    }
  };

  useEffect(() => {
    if (!socket) return;

    // Listen for when the socket is connected and its ID is available
    socket.on("connect", () => {
      setSocketInstance(socket);
      setUserIdInstance(socket.id as any); // Now socket.id should be available
      console.log("Socket connected with ID:", socket.id);
    });

    socket.on("matchFound", () => {
      setIsLoading(false); // Stop loading when match is found
      setIsMatched(true); // Set matched state to true
    });

    // Clean up event listeners when the component is unmounted or socket changes
    return () => {
      socket.off("matchFound");
      socket.off("connect");
    };
  }, [socket]); // Re-run effect if socket changes

  return (
    <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
      {!isMatched && (
        <div className="flex flex-col items-center space-y-8">
          <button
            onClick={handleJoinRoom}
            disabled={isLoading} // Disable button while loading
            className={
              isLoading
                ? "text-black  "
                : "text-white bg-purpleColor font-semi-bold py-2 px-4 rounded-lg"
            }
          >
            {isLoading ? "Searching for a match..." : "Match Make"}
          </button>
          {isLoading && (
            <div className="justify-center items-center">
              <Loader />
            </div>
          )}
        </div>
      )}

      {isMatched && <div className="w-full">{children}</div>}
    </div>
  );
};

export default MatchMakingSection;
