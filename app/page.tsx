import { signIn } from "@/auth";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
  const handleSignIn = async () => {
    "use server";
    await signIn("google", { redirectTo: "/chat" });
  };

  return (
    <div className="bg-white">
      <main className="w-full h-screen bg-white flex flex-col">
        <header className="mx-2 mt-5 md:mx-5">
          <Image src="/logoNew.png" alt="logo" width={100} height={100} />
        </header>

        <section className="flex flex-col md:flex-row items-center justify-center flex-grow px-6 md:px-12">
          <div className="md:w-1/2  mt-3  md:text-left">
            <h1 className="relative text-4xl md:text-6xl font-bold text-black">
              <span className="relative inline-block">
                chat
                <Image
                  src="/handDrawn.png"
                  alt="logo"
                  width={800}
                  height={800}
                  className="absolute -top-3 -left-3"
                />
              </span>{" "}
              with strangers without a hitch
            </h1>

            <h3 className="text-sm font-light text-black mt-3">
              Meet new people, start conversations, and make connections—all in
              real-time.
            </h3>

            <form action={handleSignIn} className="mt-10">
              <button
                className="flex items-center gap-3 border-2 border-zinc-800 text-black rounded-lg px-6 py-2 hover:bg-gray-100 transition mt-10"
                type="submit"
              >
                <Image src="/google.png" alt="Google" width={20} height={20} />
                Continue with Google
              </button>
            </form>
          </div>

          <div className="md:w-1/2 mt-20 md:mx-20 md:mt-0 md:ml-10">
            <Image
              src="/heroImageIllustration.png"
              alt="hero"
              width={700}
              height={700}
              className="md:mx-10"
            />
          </div>
        </section>
      </main>
      <footer className="mx-25 mb-6 bg-white">
        <hr className="md:mx-5 mt-10 border-zinc-300 " />
        <div className="flex justify-between mt-10 mb-5 md:mx-5">
          <p className="font-light text-xs md:mx-2  text-black">
            &copy;{new Date().getFullYear()} Anesu Nyakonda
          </p>
          <div className="flex space-x-3">
            <Link
              href={"/terms"}
              className="font-light text-xs underline text-black"
            >
              Terms and conditions
            </Link>

            <Link
              href={"/terms"}
              className="font-light text-xs underline pr-3  text-black"
            >
              {" "}
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
