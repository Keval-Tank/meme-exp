"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export function Dashboard({ session }: { session: any }) {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-out`, {
        method: "POST",
        credentials: "include",
      });
      window.location.reload();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome!</h1>
          <p className="mt-2 text-sm text-gray-600">You are successfully signed in</p>
        </div>

        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
            <p className="mt-1 font-medium text-gray-900">{session.user?.email || "N/A"}</p>
          </div>
          
          {session.user?.name && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
              <p className="mt-1 font-medium text-gray-900">{session.user.name}</p>
            </div>
          )}

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">User ID</p>
            <p className="mt-1 font-mono text-sm text-gray-900">{session.user?.id || "N/A"}</p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          disabled={loading}
          className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );
}