import { signIn } from "@/auth";

import Image from "next/image";

export default function Home() {
  return (
    <main className="w-full h-screen bg-white">
      <nav>
        <Image src="/logNew.png" alt="logo" width={100} height={100} />
      </nav>
      <div className=" md:flex items-center  ">
        <div className="md:flex mt-10">
          <div className="flex-col md:w-1/3">
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
                <Image
                  src="/google.png"
                  alt="google"
                  width={20}
                  height={20}
                  className="px-3"
                />
                Continue with Google
              </button>
            </form>
          </div>
          <div className="md:w-2/3 md:mx-10">
            <Image src="/heroImage.png" alt="hero" width={750} height={750} />
          </div>
        </div>
      </div>
    </main>
  );
}
