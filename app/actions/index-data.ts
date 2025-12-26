"use server"
import { pineconeIndex } from "@/lib/pinecone";
import { readFileSync } from "fs";

const memeTemplates = JSON.parse(readFileSync("./data.json", "utf-8"))

export async function indexData(){
    try{
        await pineconeIndex.upsertRecords(memeTemplates.data.memes)
        console.log("indexing completed")
    }catch(error){
        console.log("Failed to index data -> ", error)
    }
}