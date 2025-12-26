"use client"
import { indexData } from "./actions/index-data";
import { Button } from "@/components/ui/button";

export default function Home() {

  return (
    <div>
      <Button className="bg-white text-black" onClick={indexData}>Index Data</Button>
    </div>
  );
}
