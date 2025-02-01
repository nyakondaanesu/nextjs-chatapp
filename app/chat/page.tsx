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
      <section className="mx-6  bg-primary flex mt-10">
        <div className="flex bg-accent min-h-dvh">
          <nav className="flex space-x-10 mx-4">
            <span className="text-white">Chat</span>
            <span>Space</span>
            <span>Video</span>
          </nav>
        </div>
        <div className="">chat room</div>
      </section>
    </>
  );
};

export default Chat;
