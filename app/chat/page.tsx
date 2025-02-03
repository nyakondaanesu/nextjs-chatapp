"use client";
import Image from "next/image";
import useSocket from "../(customHooks)/customHook";
import { useEffect, useState } from "react";
import Link from "next/link";
import AppSideBar from "@/components/appSideBar";
import MatchMakingSection from "@/components/matchMakingSection";

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
      <AppSideBar children={<MatchMakingSection />}></AppSideBar>
    </>
  );
};

export default Chat;
