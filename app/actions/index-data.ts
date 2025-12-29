"use server"
import { pineconeIndex } from "@/lib/pinecone";
import { readFileSync } from "fs";
import { embed, generateText } from "ai"
import { google } from "@ai-sdk/google"
import type { Template } from "@/lib/features/memes-templates-store/memesThunk";
import { supabase } from "@/lib/supabase/supabaseClient";
import { createGroq } from "@ai-sdk/groq"


const memeTemplates = JSON.parse(readFileSync("./data.json", "utf-8"))
const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY!
})

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

export async function generateEmbeddings(text: string) {
    const { embedding } = await embed({
        model: google.embeddingModel('text-embedding-004'),
        value: text
    })
    return embedding
}

export async function urlToBlob(url: string) {
    const result = await fetch(url)
    const blob = await result.blob()
    return await blob.arrayBuffer()
}

export async function indexData(user_prompt: string): Promise<Template[] | null> {
    try {
        // for(const template of memeTemplates.data.memes){

        // }
        // for(const template of memeTemplates.data.memes){
        //     const {data} = await supabase.storage.from('meme-templates').getPublicUrl(template.id)
        //     const {data:dbData, error :dbError} = await supabase.from('templates').insert([{
        //          id : template.id,
        //         name : template.name,
        //         width : template.width,
        //         height : template.height,
        //         box_count : template.box_count,
        //         tags : template.tags,
        //         url : data.publicUrl,
        //         description : template.semantic_description,
        //         keywords : template.keywords,
        //         tone : template.tone,
        //         topics : template.topics 
        //     }])
        // }
        // console.log("Done !")
        // for(const template of memeTemplates.data.memes){
        //     const semantic_text = `
        //     Meme Template : ${template.name}
        //     Description : ${template.semantic_description}
        //     Keywords : ${template.keywords.join(", ")}
        //     Topics : ${template.topics.join(', ')}
        //     Tags : ${template.tags.join(', ')}
        //     Tone : ${template.tone.split(";").join(", ")}
        //     `.trim()

        //     const embeddings = await generateEmbeddings(semantic_text)

        //     // vector
        //     await pineconeIndex.upsert([{
        //         id : template.id,
        //         values : embeddings,
        //     }])

        //     // database
        //     const {data, error} = await supabase.from('templates').insert([{
        //         id : template.id,
        //         name : template.name,
        //         width : template.width,
        //         height : template.height,
        //         box_count : template.box_count,
        //         tags : template.tags
        //     }])

        //     // bucket
        //     try{
        //         const buffer = await urlToBlob(template.url)
        //         const {data, error} = await supabase.storage.from("meme-templates").upload(`${template.id}`,buffer,{
        //             contentType : `image/${template.url.split('.').pop()}`
        //         })
        //         if(error){
        //             console.log("during storing file in a bucket :  ", template.name)
        //             throw error
        //         }
        //     }catch(error){
        //         console.log("error occured during bucket storage a file : ", error)
        //         break
        //     }

        //     if(error){
        //         console.log("Failed to store file in database", template.name)
        //         break;
        //     }

        //     console.log("Done !")
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
        const query = await generateEmbeddings(user_prompt)
        const result = await pineconeIndex.query({
            topK: 10,
            vector: query,
            includeMetadata: true
        })
        // console.log("indexing completed")
        const templateIds = result.matches.map(match => match.id)
        const templateData: Array<Template> = []
        for (const id of templateIds) {
            const { data: dbData, error: dbError } = await supabase.from('templates').select().eq('id', id)
            if (dbError) {
                console.log("Failed to fetch Data -> ", dbError)
                break
            }
            const caption_blocks = dbData[0].box_count
            const meme_captions: Array<string> = []
            const prompt = `You are a master meme caption writer. Write SHORT captions ONLY.

MEME: ${dbData[0].name}
TONE: ${dbData[0].tone}
BLOCKS: ${caption_blocks}

CONTEXT: ${user_prompt}

STRICT RULES:
✓ MAX 5 WORDS per caption
✓ Fuse [template mechanic] + [context]
✓ Use "|" separator only
✓ Match ${dbData[0].tone} tone
✓ Make it punchy and funny

TEMPLATE: ${dbData[0].name}

KEYWORDS: ${dbData[0].keywords.slice(0, 2).join(', ')}

OUTPUT CAPTIONS ONLY:
Caption1|Caption2${caption_blocks > 2 ? '|Caption3' : ''}`

            const { text } = await generateText({
                model: groq('llama-3.1-8b-instant'),
                prompt: prompt
            })
            // dbData[0].captions.push(captions.split('|'))
            templateData.push(dbData[0])
            templateData[templateData.length - 1].meme_captions = text.split("|").map(caption => caption.trim()).filter(caption => caption.length > 0)
        }
        // console.log("results -> ", templateData)
        // console.log("template data from database -> ", templateData)

        return templateData
    } catch (error) {
        console.log("Failed to index data -> ", error)
        return null
    }
}