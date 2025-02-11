import { SessionProvider } from "next-auth/react";
import Video from "./(peer)/peer.video";

const Home = () => {
  return (
    <>
      <SessionProvider>
        <Video />
      </SessionProvider>
    </>
  );
};

export default Home;
