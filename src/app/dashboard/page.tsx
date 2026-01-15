"use client"
import SignOutButton from "@/src/components/SignOutButton";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/router";
import React from 'react'

const page = () => {
  return (
    <div>
        DashBoard 
        <SignOutButton/>
        <Button onClick={() => window.location.href="http://localhost:3000/template"}></Button>
    </div>
  )
}

export default page