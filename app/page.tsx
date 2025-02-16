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
      <main className="w-full min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-4 mt-5 md:px-8">
          <Image
            src="/logoNew.png"
            alt="logo"
            width={100}
            height={100}
            priority
          />
        </header>

        {/* Main Section */}
        <section className="flex flex-col md:flex-row items-center justify-center flex-grow px-4 md:px-12">
          {/* Left Content */}
          <div className="md:w-1/2 mt-5 md:mt-0 text-center md:text-left max-w-[90%] md:max-w-none">
            <h1 className="text-4xl md:text-7xl font-bold text-black leading-tight">
              <span className="flex justify-center md:justify-start items-center">
                chat
                <Image
                  src="/megaPhone.png"
                  alt="megaphone"
                  width={100}
                  height={100}
                  className="ml-2 md:ml-3 w-10 md:w-20"
                />
              </span>
              with strangers without a hitch
            </h1>

            <h3 className="text-sm font-light text-black mt-3">
              Meet new people, start conversations, and make connections—all in
              real-time.
            </h3>

            <form action={handleSignIn} className="mt-10">
              <button
                className="flex items-center justify-center gap-3 border-2 border-zinc-800 text-black rounded-lg px-6 py-2 hover:bg-gray-100 transition"
                type="submit"
              >
                <Image src="/google.png" alt="Google" width={20} height={20} />
                CONTINUE WITH GOOGLE
              </button>
            </form>
          </div>

          {/* Right Image */}
          <div className="relative md:w-1/2 mt-12 md:mt-0">
            <Image
              src="/stars.png"
              alt="stars"
              width={100}
              height={100}
              className="absolute -top-4 left-8 w-16 md:w-20"
            />
            <Image
              src="/heroImageIllustration.png"
              alt="hero"
              width={0}
              height={0}
              sizes="(max-width: 768px) 80vw, 50vw"
              className="w-full md:w-[500px]"
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-4 mt-10">
        <hr className="border-zinc-300" />
        <div className="flex flex-col md:flex-row justify-between mt-6 md:mt-10">
          <p className="font-light text-xs text-black text-center md:text-left">
            &copy;{new Date().getFullYear()} Anesu Nyakonda
          </p>
          <div className="flex justify-center md:justify-end space-x-3 mt-2 md:mt-0">
            <Link
              href="/terms"
              className="font-light text-xs underline text-black"
            >
              Terms and Conditions
            </Link>
            <Link
              href="/terms"
              className="font-light text-xs underline text-black"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
