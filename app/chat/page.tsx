import AppSideBar from "@/components/appSideBar";
import MatchMakingSection from "@/components/matchMakingSection";
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
      <AppSideBar>
        <MatchMakingSection />
        <footer className="bg-main mt-10">
          <hr className="md:mx-28 mt-10 border-zinc-800" />
          <div className="flex justify-between mt-10">
            <p className="font-light text-xs md:mx-28">
              &copy;{new Date().getFullYear()} Anesu Nyakonda
            </p>
            <div className="flex space-x-5">
              <p className="font-light text-xs   underline">
                Terms & conditions
              </p>
              <p className="font-light text-xs underline pr-10">
                Privacy Policy
              </p>
            </div>
          </div>
        </footer>
      </AppSideBar>
    </SessionProvider>
  );
};

export default Chat;
