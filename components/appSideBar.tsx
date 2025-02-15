"use client";
import { SidebarGroup, SidebarProvider } from "./ui/sidebar";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LogOutDropDown from "./logOutDropDown";

const AppSideBar = ({ children }: { children: React.ReactNode }) => {
  const [isSideOpen, setSideOpen] = useState(false);
  const toggleSidebar = () => setSideOpen((prev) => !prev);
  const { data: Session } = useSession();
  const userProfilePic = Session?.user?.image;
  const username = Session?.user?.name;

  return (
    <>
      <SidebarProvider>
        <button
          onClick={toggleSidebar}
          className="fixed top-10 left z-[100] text-white rounded-md "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
            />
          </svg>
        </button>

        {isSideOpen && (
          <div
            className={
              `bg-side text-white flex flex-col h-screen transition-all duration-300 ease-in-out transform translate-x-0
         ` + (isSideOpen ? "translate-x-0" : "-translate-x-full")
            }
          >
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center mx-8 w-full">
                <Image
                  className=""
                  src="/newLogo.png"
                  alt="Hero image"
                  id="logo"
                  width={150}
                  height={150}
                  priority
                />
              </div>
            </div>

            <SidebarGroup className="mt-10 space-y-8 mx-2 flex-grow">
              <Link
                href={"/chat"}
                className="flex items-center text-white text-sm font-semibold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-7 mx-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                  />
                </svg>
                Chat
              </Link>

              <Link
                href={"/space"}
                className="flex items-center text-white text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-7 mx-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                  />
                </svg>
                Space
              </Link>

              <Link
                href={"/video"}
                className="flex items-center text-white text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-7 mx-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
                Video
              </Link>
              <hr className="border-t-2 border-zinc-700 my-2 mr-2" />
            </SidebarGroup>

            <div className="p-4 text-center items-center flex">
              {userProfilePic && username && (
                <LogOutDropDown name={username} userImage={userProfilePic} />
              )}
            </div>
          </div>
        )}

        <div className="w-full h-screen overflow-y-scroll">{children}</div>
      </SidebarProvider>
    </>
  );
};

export default AppSideBar;
