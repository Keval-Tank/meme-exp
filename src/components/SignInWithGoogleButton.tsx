"use client";
import { Button } from "@/src/components/ui/button";

export default function SignInWithGoogleButton() {
    const BackendURL = process.env.NEXT_PUBLIC_BACKEND_URL
    if(!BackendURL){
        return (
            <div>
                Backend Url not found
            </div>
        )
    }
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => (window.location.href = `${BackendURL}/api/auth/signingoogle`)}
    >
      Sign in with Google
    </Button>
  )
}