"use client";

import useSocket from "@/app/(customHooks)/customHook";
import { useSession } from "next-auth/react";
import { setSocketInstance } from "../lib/socketInstance";
import { setUserIdInstance } from "../lib/socketInstance";
import React, { useEffect, useState } from "react";
import Loader from "./cluter";
import Button from "./matchButton";
import NewMatchButton from "./newMatch";
import Messages from "./message";

const MatchMakingSection = () => {
  const { data: session } = useSession();
  const { socket, googleUserId, googleProfilePic } = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [matchedUser, setMatchedUser] = useState<string | null>(null);
  const [matchedUserPic, setMatchedUserPic] = useState<string | null>(null);
  const [isSearchingDisc, setIsSearchingDisc] = useState(false);
  const [isReset, setOnReset] = useState(false);

  const name = session?.user?.name;

  const handleJoinRoom = () => {
    if (socket) {
      setIsLoading(true); // Set loading state to true when matchmaking starts
      socket.emit("joinPrivateChat", googleUserId); // Emit event to server
    }
  };

  const handleNewMatch = () => {
    if (socket) {
      setIsMatched(false); // Reset match state
      setMatchedUser(null);
      setMatchedUserPic(null);
      setIsLoading(true);
      setOnReset(true);

      socket.emit("authenticate", { googleUserId, googleProfilePic });
      socket.emit("joinPrivateChat", googleUserId);
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
        setMatchedUserPic(data.otherUser.image);
      } else {
        // we are talking with other user
        setMatchedUser(data.thisUser.username);
        setMatchedUserPic(data.thisUser.image);
      }
      // Set matched state to true
    });

    socket.on("userDisconnected", ({ userId, message }) => {
      setIsMatched(false);
      setIsLoading(true);
      setMatchedUser(null);
      setMatchedUserPic(null);
      setIsSearchingDisc(true);
      console.log(`User ${userId} disconnected: ${message}`);
    });

    // Clean up event listeners when the component is unmounted or socket changes
    return () => {
      socket.off("matchFound");
      socket.off("connect");
      socket.off("userDisconnected");
    };
  }, [socket]); // Re-run effect if socket changes

  return (
    <div className="flex justify-center items-center h-dvh">
      {!isMatched && (
        <div className="flex text-center flex-col items-center space-y-2">
          <h5
            className={
              isLoading && isReset
                ? `hidden`
                : `text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 text-transparent bg-clip-text`
            }
          >
            {`hello, ${name}`}
          </h5>
          <h1
            className={
              isLoading ? `hidden` : `text-white text-3xl font-semibold mx-3`
            }
          >
            Meet, Connect and Chat with <br className="hidden md:block" />{" "}
            Random Strangers
          </h1>
          <h6
            className={
              isLoading ? `hidden` : `text-white text-xs font-thin mx-3`
            }
          >
            Experience Spontaneous Conversations with Strangers
          </h6>

          <Button
            onClick={handleJoinRoom}
            isLoading={isLoading}
            isSearchingDisc={isSearchingDisc}
            // Pass isLoading prop
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
          <div className="flex bg-zinc-800 p-4 items center justify-between">
            {matchedUserPic && (
              <>
                <div className="flex items-center">
                  <img
                    src={matchedUserPic}
                    width={32}
                    height={32}
                    alt="profile image"
                    className="rounded-full mx-6"
                  />
                  <p className="text-white text-xs hidden md:block">{` ${matchedUser}`}</p>
                </div>
                <NewMatchButton
                  onClick={handleNewMatch}
                  isLoading={isLoading}
                ></NewMatchButton>
              </>
            )}
          </div>
          {isMatched && <Messages></Messages>}
        </div>
      )}
    </div>
  );
};

export default MatchMakingSection;
