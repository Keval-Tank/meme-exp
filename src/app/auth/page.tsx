"use client"
import SignUpForm from "@/src/components/SignUpForm";
import LoginForm from "@/src/components/LoginForm";
import SignInWithGoogleButton from "@/src/components/SignInWithGoogleButton";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AuthPage() {
  const searchParams = useSearchParams()
  const type = searchParams.get("type")
  const [mode, setMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    if(type === "signup" || type === "login"){
      setMode(type)
    }
  }, [type]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <SignInWithGoogleButton />
          <div className="flex items-center w-full my-2">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-2 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>
        </div>
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 rounded-l ${mode === "login" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setMode("login")}
          >
            Log In
          </button>
          <button
            className={`px-4 py-2 rounded-r ${mode === "signup" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>
        {mode === "login" ? (
          <>
            <LoginForm />
            <div className="text-center mt-4 text-sm">
              Don't have an account?{" "}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </div>
          </>
        ) : (
          <>
            <SignUpForm />
            <div className="text-center mt-4 text-sm">
              Already have an account?{" "}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setMode("login")}
              >
                Log In
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}