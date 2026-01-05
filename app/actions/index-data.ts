"use server"
import { pineconeIndex } from "@/lib/pinecone";
import { readFileSync } from "fs";
import { embed, generateText } from "ai"
import { google } from "@ai-sdk/google"
import type { Template } from "@/lib/features/memes-templates-store/memesThunk";
import { supabase } from "@/lib/supabase/supabaseClient";
import { createGroq } from "@ai-sdk/groq"



const memeTemplates = JSON.parse(readFileSync("./data.json", "utf-8"))
export const groq = createGroq({
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

export async function indexEnbeddedData(embeddings : number[], id:string) {
    try {
        await pineconeIndex.upsert([{
            id,
            values: embeddings
        }])
    } catch (error) {
        console.log("failed to index template data ->", error)
    }
}

export async function indexData(user_prompt: string): Promise<Template[] | null | void> {
    try {
        // for(const template of memeTemplates.data.memes){

        // }
        // for(const template of memeTemplates.data.memes){
        //     // console.log(template.caption_areas)
        //     const {data} = await supabase.storage.from('meme-templates').getPublicUrl(template.id)
        //     const {data:dbData, error :dbError} = await supabase.from('templates').insert([{
        //         id : template.id,
        //         name : template.name,
        //         width : template.width,
        //         height : template.height,
        //         box_count : template.box_count,
        //         tags : template.tags,
        //         url : data.publicUrl,
        //         description : template.semantic_description,
        //         keywords : template.keywords,
        //         tone : template.tone.join(","),
        //         topics : template.topics,
        //         caption_areas : template.caption_areas
        //     }])
        //     if(dbError){
        //         console.log("Failed to load data", dbError)
        //     }
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
        // UNCOMMENT FROM HERE
        const query = await generateEmbeddings(user_prompt)
        const { text: context } = await generateText({
            model: groq('openai/gpt-oss-120b'),
            prompt: `You are an expert at analyzing text to extract emotional context, tone, and narrative intent. 
Your job is to deconstruct user input and produce structured context that a meme caption writer can use to generate FUNNY, RELEVANT captions.

Think step-by-step:
1. IDENTIFY: What is the core situation or scenario the user is describing?
2. EMOTION: What emotional state(s) are present? (frustration, joy, sarcasm, irony, desperation, etc.)
3. TONE: What voice should captions have? (dark humor, sarcastic, witty, relatable, absurd, etc.)
4. THEMES: What are the underlying themes or pain points? (work stress, relationships, technology, procrastination, etc.)
5. RELATABLE ANGLE: How can this resonate with others? What's the universal aspect?
6. MEME NARRATIVE: What's the "story" or "contrast" that a meme template could play on?

USER INPUT: "${user_prompt}"

Analyze this step-by-step and output ONLY valid JSON with NO markdown, NO comments, NO extra text:

{
  "situation": "brief description of what's happening (1-2 sentences)",
  "primary_emotion": "dominant emotion (e.g., frustration, sarcasm, resignation, overwhelm)",
  "secondary_emotions": ["secondary emotion if any"],
  "tone_for_captions": "voice/style for meme captions (e.g., dark humor, self-deprecating, witty, painfully relatable)",
  "core_themes": ["theme1", "theme2", "theme3"],
  "pain_points": ["specific frustration or contradiction"],
  "relatable_angle": "why others would find this funny/relatable",
  "contrast_or_irony": "the core contrast/contradiction that makes it meme-worthy",
  "suggested_narrative": "how a meme template could play into this (e.g., 'approving good thing vs rejecting bad thing')",
  "keywords_for_captions": ["keyword1", "keyword2", "keyword3", "keyword4"],
  "caption_direction": "brief direction for what the captions should emphasize"
}`
        })
        // console.log("context -> ", context)
        const result = await pineconeIndex.query({
            topK: 5,
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
            if (!dbData[0] || dbData.length === 0) {
                console.log("Failed to fetch Data -> ", dbError)
                continue
            }
            // console.log(dbData)
            // const caption_blocks = dbData[0].box_count
            // const meme_captions: Array<string> = []
            const prompt = `You are an expert meme caption writer. Generate SHORT, PUNCHY captions that match the template's scenario and the user's context.

RULES (CRITICAL - FOLLOW EXACTLY):
✓ MAXIMUM 3-5 words per caption
✓ Simple, easy-to-understand English
✓ Align with template's meme mechanics
✓ Match the ${dbData[0].tone} tone exactly
✓ Make it funny by playing on the template's scenario
✓ Output captions ONLY, separated by "|"
✓ No explanations, hashtags, or extra text

Must use this context along with further provided meme template data for generating captions
context : ${JSON.stringify(context)}

EXAMPLE 1:
Template: Drake Hotline Bling (shows Drake rejecting/approving things)
User Context: avoiding a tough project deadline
Output: Scrolling TikTok|Actually starting work

EXAMPLE 2:
Template: Distracted Boyfriend (guy checks out new thing while girlfriend is upset)
User Context: choosing between sleep and debugging code
Output: Sleep|Finding that one bug

EXAMPLE 3:
Template: Woman Yelling at Cat (woman angry, cat confused)
User Context: git merge conflicts
Output: Git merge messages|My perfectly working code

---

NOW GENERATE CAPTIONS FOR AND KEEP ABOVE PROVIDED CONTEXT IN MIND:
Template: ${dbData[0].name}
Template Description: ${dbData[0].description} (This is the template's scenario)
Tone: ${dbData[0].tone}
User Context: ${user_prompt}
Keywords to use: ${dbData[0].keywords.slice(0, 3).join(', ')}
Number of captions: ${dbData[0].box_count}
Must Follow the given output format and avoid any kind of additional content or text (output must be just captions and nothing else and separate captions using coma(',').)

Output Format (STRICT) (caption1|caption2${dbData[0].box_count > 2 ? '|caption3' : ''}):`

            const { text } = await generateText({
                model: groq('moonshotai/kimi-k2-instruct-0905'),
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