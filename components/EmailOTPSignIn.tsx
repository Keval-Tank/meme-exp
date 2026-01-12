"use client";

import { useState } from "react";
import { signIn, authClient } from "@/lib/auth-client";
import { redirect, useRouter } from "next/navigation";

const Page = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp" >("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rateLimited, setRateLimited] = useState(false);
  const router = useRouter();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
  setLoading(true);
  setError("");
  setRateLimited(false);

    try {
      const response = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });
      if(response.error){
        const message = response.error.message || "Too many requests. Please try again in 1 minute.";
        if (
          response.error.status === 429 ||
          response.error.code === "too_many_requests" ||
          message.toLowerCase().includes("rate")
        ) {
          setRateLimited(true);
          setError("Too many requests. Please try again in 1 minute.");
        } else {
          setError(message);
        }
        return;
      }
      setStep("otp");
    } catch (err: any) {
      const message = err?.message || "Too many requests. Please try again in 1 minute.";
      if (message.toLowerCase().includes("rate")) {
        setRateLimited(true);
        setError("Too many requests. Please try again in 1 minute.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
  setLoading(true);
  setError("");
  setRateLimited(false);

    try {
      await signIn.emailOtp({
        email,
        otp,
      });
      redirect('http://localhost:3000/dashboard')
    } catch (err: any) {
      const message = err?.message || "Invalid OTP";
      if (message.toLowerCase().includes("rate")) {
        setRateLimited(true);
        setError("Too many requests. Please try again in 1 minute.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-black min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {step === "email" ? "Sign In" : "Verify OTP"}
        </h1>

        {rateLimited && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
            Too many requests. Please try again in 1 minute.
          </div>
        )}

        {error && !rateLimited && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-digit OTP
              </label>
              <p className="text-sm text-gray-500 mb-3">
                We sent a code to {email}
              </p>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="000000"
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
                setError("");
              }}
              className="w-full text-blue-600 hover:text-blue-700 text-sm"
            >
              Change email address
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Page;