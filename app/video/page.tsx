import { SessionProvider } from "next-auth/react";
import Video from "./(peer)/peer.video";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AppSideBar from "@/components/appSideBar";

const Home = async () => {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  return (
    <>
      <SessionProvider session={session}>
        <AppSideBar>
          <Video />
          <footer className="bg-main mt-10 mb-2">
            <hr className="md:mx-25 mt-10 border-zinc-800" />
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
    </>
  );
};

export default Home;
