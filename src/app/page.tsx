"use client"
import Image from "next/image";
import { Button } from "../components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleAuthRedirect = (type:string) => {
    router.push(`/auth?type=${type}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">Meme GPT</h1>
      <p className="text-lg mb-8 text-gray-600">
        Instantly generate memes with the most suitable captions using AI!
      </p>
      <div className="flex gap-4">
        <Button
          onClick={() => handleAuthRedirect("login")}
          className="px-6 py-3 text-base rounded-lg bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition"
        >
          Login
        </Button>
        <Button
          onClick={() => handleAuthRedirect("signup")}
          className="px-6 py-3 text-base rounded-lg border border-indigo-500 bg-white text-indigo-500 font-bold hover:bg-indigo-50 transition"
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
}
