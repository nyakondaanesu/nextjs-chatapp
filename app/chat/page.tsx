import AppSideBar from "@/components/appSideBar";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";

const Chat = async () => {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  return (
    <SessionProvider session={session}>
      <AppSideBar></AppSideBar>
    </SessionProvider>
  );
};

export default Chat;
