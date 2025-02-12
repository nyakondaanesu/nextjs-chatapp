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
        </AppSideBar>
      </SessionProvider>
    </>
  );
};

export default Home;
