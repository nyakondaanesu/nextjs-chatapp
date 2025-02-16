import { signIn } from "@/auth";
import GoogleButton from "@/components/googleSign";

import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <nav>
        <Image src="/newLogo.png" alt="logo" width={100} height={100} />
      </nav>
      <section className="md:flex flex-col items-center justify-center mt-10">
        <div className="flex-col w-1/3">
          <h1 className="text-5xl font-bold">
            Chat with strangers without a Hitch
          </h1>
          <h3 className="mt-4 font-thin">
            Meet new people, start conversations, and make connections—all in
            real time
          </h3>
          <form
            className="mt-4"
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/chat" });
            }}
          >
            <GoogleButton></GoogleButton>
          </form>
        </div>
        <div className="w-2/3">
          <Image src="/heroImage.png" alt="hero" width={500} height={500} />
        </div>
      </section>
    </div>
  );
}
