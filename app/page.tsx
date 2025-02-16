import { signIn } from "@/auth";

import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-screen md:flex items-center  bg-white">
      <nav>
        <Image src="/newLogo.png" alt="logo" width={100} height={100} />
      </nav>
      <div className="md:flex mt-10">
        <div className="flex-col w-1/3">
          <h1 className="text-5xl font-bold text-black">
            Chat with strangers without a Hitch
          </h1>
          <h3 className="mt-4 font-thin text-black">
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
            <button
              className="button border-2 border-zinc text-black rounded-lg px-4 py-2"
              type="submit"
            >
              Continue with Google
            </button>
          </form>
        </div>
        <div className="w-2/3">
          <Image src="/heroImage.png" alt="hero" width={500} height={500} />
        </div>
      </div>
    </div>
  );
}
