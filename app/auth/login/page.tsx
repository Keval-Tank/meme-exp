"use client";

import { authClient } from "@/lib/auth-client";
import EmailOtpSignIn from "@/components/EmailOTPSignIn";
import { GoogleSignIn } from "@/components/GoogleSignIn";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (session) {
    return <Dashboard session={session} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>
        
        < EmailOtpSignIn />
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <GoogleSignIn />
      </div>
    </div>
  );
}