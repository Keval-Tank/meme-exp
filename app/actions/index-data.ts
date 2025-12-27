"use server"
import { pineconeIndex } from "@/lib/pinecone";
import { readFileSync} from "fs";
import { embed } from "ai"
import { google } from "@ai-sdk/google"
import type { Template } from "@/lib/features/memes-templates-store/memesThunk";


const memeTemplates = JSON.parse(readFileSync("./data.json", "utf-8"))

interface MemeTemplate {
    id: string,
    name: string,
    url: string,
    width: number,
    height: number,
    box_count: number,
    captions: number,
    keywords: string[],
    topics: string[],
    tone: string,
    semantic_description: string
}

export async function generateEmbeddings(text:string) {
    const {embedding} = await embed({
        model : google.embeddingModel('text-embedding-004'),
        value : text
    })
    return embedding
}

export async function indexData() : Promise<Template[] | null>{
    try {
        // for(const template of memeTemplates.data.memes){
        //     const semantic_text = `
        //     Meme Template : ${template.name}
        //     Description : ${template.semantic_description}
        //     Keywords : ${template.keywords.join(", ")}
        //     Topics : ${template.topics.join(', ')}
        //     Tone : ${template.tone.split(";").join(", ")}
        //     `.trim()

        //     const embeddings = await generateEmbeddings(semantic_text)

        //     await pineconeIndex.upsert([{
        //         id : template.id,
        //         values : embeddings,
        //         metadata : {
        //             name : template.name,
        //             url : template.url,
        //             width : template.width,
        //             height : template.height,
        //             caption_areas : template.box_count
        //         }
        //     }])
        // }
        // const template = memeTemplates.data.memes[0]
        // const semantic_text = `
        //     Meme Template : ${template.name}
        //     Description : ${template.semantic_description}
        //     Keywords : ${template.keywords.join(", ")}
        //     Topics : ${template.topics.join(', ')}
        //     Tone : ${template.tone.split(";").join(", ")}
        //     `.trim()
        // const embeddings = await generateEmbeddings(semantic_text)
        // await writeFile('embed.txt',new Uint8Array(embeddings), (err) => {
        //     console.log("Failed to write", err)
        // })
        const query = await generateEmbeddings("funny office memes")
        const result = await pineconeIndex.query({
            topK : 5,
            vector : query,
            includeMetadata : true
        })
        // console.log("indexing completed")
        // console.log("results -> ", result.matches.map(match => match.metadata))
        return result.matches.map(match => match.metadata)
    } catch (error) {
        console.log("Failed to index data -> ", error)
        return null
    }
}