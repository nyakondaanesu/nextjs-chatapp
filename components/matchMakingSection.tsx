"use client";

import useSocket from "@/app/(customHooks)/customHook";
import { setSocketInstance } from "../lib/socketInstance";
import { setUserIdInstance } from "../lib/socketInstance";
import React, { useEffect, useState } from "react";
export let convo = false;

const MatchMakingSection = ({ children }: { children: React.ReactNode }) => {
  const { socket, userID } = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [isMatched, setIsMatched] = useState(false);

  useEffect(() => {
    if (socket) {
      setSocketInstance(socket);
      setUserIdInstance(userID);
    }
  }, [socket]);

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
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        {!isMatched && (
          <button
            onClick={handleJoinRoom}
            disabled={isLoading} // Disable button while loading
            className="text-black"
          >
            {isLoading ? "Searching for a match..." : "Match Make"}
          </button>
        )}

        {isMatched && <div> {children}</div>}
      </div>
    </>
  );
};

export default MatchMakingSection;
