"use client";
import Image from "next/image";
import useSocket from "../(customHooks)/customHook";

const Chat = () => {
  const { socket, userID } = useSocket();
  type room = {
    roomId: string;
    roomMembers: string[];
    isfull: boolean;
  };

  const handleJoinRoom = () => {
    //create a private room

    socket?.emit("joinPrivateChat", socket.id);
  };

  return (
    <>
      <section className="mt-10 flex mx-5 h-[calc(100vh-128px)]">
        <div className="bg-accent w-1/4">side panel</div>
        <div className="bg-primary w-3/4 flex justify-center">chat room</div>
      </section>
    </>
  );
};

export default Chat;
