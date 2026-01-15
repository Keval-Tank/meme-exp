"use client";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const BackendURL = process.env.NEXT_PUBLIC_BACKEND_URL
  if(!BackendURL){
    return (
        <div>
            Backend URL not found
        </div>
    )
  }
  const handleSignOut = async () => {
    await fetch(`${BackendURL}/api/auth/signout`, 
        { 
            method: "GET", 
            credentials : 'include' 
        });
    window.location.href = "/text-to-meme"; 
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleSignOut}
    >
      Sign Out
    </Button>
  );
}