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
      <section>
        <div className="flex justify-between bg-red-900">
          <span>
            <label htmlFor="">Anesu Nyakonda</label>
          </span>
          <ul className="flex space-x-6">
            <li>
              <div className="">
                <Image
                  src="/space.svg"
                  alt="Hero image"
                  width={16}
                  height={16}
                />
              </div>
            </li>
            <li>
              <div className="">
                <Image
                  src="/chat.svg"
                  alt="Hero image"
                  width={16}
                  height={16}
                />
              </div>
            </li>
            <li>
              <div className="">
                <Image
                  src="/video.png"
                  alt="Hero image"
                  width={16}
                  height={16}
                />
              </div>
            </li>
          </ul>
        </div>

        <button onClick={handleJoinRoom}>match make</button>
      </section>
    </>
  );
};

export default Chat;
