"use client";

import useSocket from "@/app/(customHooks)/customHook";
import { setSocketInstance } from "../lib/socketInstance";
import { setUserIdInstance } from "../lib/socketInstance";
import React, { useEffect, useState } from "react";
import Loader from "./cluter";
import Button from "./matchButton";

const MatchMakingSection = ({ children }: { children: React.ReactNode }) => {
  const { socket, googleUserId } = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [matchedUser, setMatchedUser] = useState<string | null>(null);

  const handleJoinRoom = () => {
    if (socket) {
      setIsLoading(true); // Set loading state to true when matchmaking starts
      socket.emit("joinPrivateChat", googleUserId); // Emit event to server
    }
  };

  useEffect(() => {
    if (!socket) return;

    // Listen for when the socket is connected and its ID is available
    socket.on("connect", () => {
      setSocketInstance(socket);
      setUserIdInstance(socket.id as string); // Now socket.id should be available
    });

    socket.on("matchFound", (data) => {
      setIsLoading(false); // Stop loading when match is found
      setIsMatched(true);
      console.log(data);
      if (data.thisUser.id === socket.id) {
        // we are talking with other user
        setMatchedUser(data.otherUser.username);
      } else {
        // we are talking with other user
        setMatchedUser(data.thisUser.username);
      }
      // Set matched state to true
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
        <div className="flex text-center flex-col items-center space-y-2">
          <h1 className="text-white text-3xl font-semibold mx-3">
            Meet, Connect and Chat with <br className="hidden md:block" />{" "}
            Random Strangers
          </h1>
          <h6 className="text-white text-sm font-thin">
            Experience Spontaneous Conversations with Strangers
          </h6>

          <Button
            onClick={handleJoinRoom}
            isLoading={isLoading} // Pass isLoading prop
          ></Button>
          {isLoading && (
            <div className="justify-center items-center">
              <Loader />
            </div>
          )}
        </div>
      )}

      {isMatched && (
        <div className="w-full">
          <p>{`talking with ${matchedUser}`}</p>
          {children}
        </div>
      )}
    </div>
  );
};

export default MatchMakingSection;
