import { SessionProvider } from "next-auth/react";
import Video from "./(peer)/peer.video";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Home = async () => {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  return (
    <>
      <SessionProvider session={session}>
        <Video />
      </SessionProvider>
    </>
  );
};

export default Home;
