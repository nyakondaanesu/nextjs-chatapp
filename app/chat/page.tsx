import AppSideBar from "@/components/appSideBar";
import MatchMakingSection from "@/components/matchMakingSection";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";

const Chat = async () => {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  return (
    <SessionProvider session={session}>
      <AppSideBar>
        <MatchMakingSection />
        <footer className="mx-2 bg-main mt-10 mb-2">
          <hr className="md:mx-25 mt-10 border-zinc-800 " />
          <div className="flex justify-between mt-10">
            <p className="font-light text-xs md:mx-28 tex-zinc-300">
              &copy;{new Date().getFullYear()} Anesu Nyakonda
            </p>
            <div className="flex space-x-5">
              <p className="font-light text-xs  tex-zinc-300  underline">
                <Link href={"/terms"}>Terms and conditions</Link>
              </p>
              <p className="font-light text-xs underline pr-10 tex-zinc-300">
                <Link href={"/terms"}> Privacy Policy</Link>
              </p>
            </div>
          </div>
        </footer>
      </AppSideBar>
    </SessionProvider>
  );
};

export default Chat;
