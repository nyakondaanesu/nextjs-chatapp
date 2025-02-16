import { signIn } from "@/auth";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
  const handleSignIn = async () => {
    "use server";
    await signIn("google", { redirectTo: "/chat" });
  };

  return (
    <main className="w-full h-screen bg-white flex flex-col">
      <header className="p-4 mx-5">
        <Image src="/logoNew.png" alt="logo" width={100} height={100} />
      </header>

      <section className="flex flex-col md:flex-row items-center justify-center flex-grow px-6 md:px-12">
        <div className="md:w-[40%] space-y-4 mt-10  md:text-left">
          <h1 className="text-5xl md:text-7xl font-bold text-black">
            Chat with strangers without a Hitch
          </h1>
          <h3 className="text-sm font-light text-black mt-5">
            Meet new people, start conversations, and make connections—all in
            real-time.
          </h3>

          <form action={handleSignIn} className="">
            <button
              className="flex items-center gap-3 border-2 border-zinc-800 text-black rounded-lg px-6 py-2 hover:bg-gray-100 transition mt-10"
              type="submit"
            >
              <Image src="/google.png" alt="Google" width={20} height={20} />
              Continue with Google
            </button>
          </form>
        </div>

        <div className="md:w-[60%] mt-20 md:mx-10 md:mt-0 md:ml-10">
          <Image
            src="/heroImageIllustration.png"
            alt="hero"
            width={700}
            height={700}
          />
        </div>
      </section>
      <footer className="mx-25  mt-10 mb-6">
        <hr className="md:mx-5 mt-10 border-zinc-300 " />
        <div className="flex justify-between mt-10">
          <p className="font-light text-xs md:mx-28  text-black">
            &copy;{new Date().getFullYear()} Anesu Nyakonda
          </p>
          <div className="flex space-x-5">
            <Link
              href={"/terms"}
              className="font-light text-xs underline pr-10 text-black"
            >
              Terms and conditions
            </Link>

            <Link
              href={"/terms"}
              className="font-light text-xs underline pr-10 text-black"
            >
              {" "}
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
