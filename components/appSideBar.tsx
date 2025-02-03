"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "./ui/sidebar";
import Image from "next/image";
import { useState } from "react";

const AppSideBar = () => {
  const [isSideOpen, setSideOpen] = useState(true);
  const toggleSidebar = () => setSideOpen((prev) => !prev);

  return (
    <>
      <SidebarProvider>
        {/* Navbar with Sidebar Trigger */}
        <nav className="bg-purpleColor py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
          <div className="flex space-x-2 items-center px-6">
            <SidebarTrigger onClick={toggleSidebar}></SidebarTrigger>
            <Image
              src="/logoChat.png"
              alt="Hero image"
              width={48}
              height={48}
            />
            <label htmlFor="" className="text-white">
              Zimbo Chat
            </label>
          </div>
          <div className="space-x-6 flex px-6">
            <span className="bg-white text-black rounded-full p-2">
              anesu nyakonda
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                />
              </svg>
            </span>
            <button className="text-white">Log Out</button>
          </div>
        </nav>

        {/* Sidebar below the navbar */}
        {isSideOpen && (
          <Sidebar className="mt-16 h-[calc(100vh-4rem)]">
            {" "}
            {/* Adjust height and margin */}
            <SidebarHeader>Users Online</SidebarHeader>
            <SidebarContent>
              {/* Sidebar content */}
              <SidebarGroup>
                <a href="/home">Home</a>
                <a href="/messages">Messages</a>
                <a href="/settings">Settings</a>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <button className="text-black">Log Out</button>
            </SidebarFooter>
          </Sidebar>
        )}
      </SidebarProvider>
    </>
  );
};

export default AppSideBar;
