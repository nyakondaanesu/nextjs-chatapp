import AppSideBar from "@/components/appSideBar";
import MatchMakingSection from "@/components/matchMakingSection";
import Messages from "@/components/message";
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
