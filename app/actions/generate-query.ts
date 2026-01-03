"use server"
import { createGroq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { pineconeIndex } from "@/lib/pinecone"
import { generateEmbeddings } from "./index-data"
import { supabase } from "@/lib/supabase/supabaseClient"

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY!
})

export async function generateQuery(userInput: string): Promise<{success: boolean, data: any, error: any}> {
    const {text} = await generateText({
        model: groq('openai/gpt-oss-120b'),
        prompt: `You are an expert semantic analyst for meme retrieval.

You will be given a raw user input:

User Input: "${userInput}"

Analyze the input deeply to extract semantic intent that can be used to retrieve the most relevant meme templates from a vector database. The database contains embeddings of meme descriptions, tones, emotions, contexts, topics, keywords, and tags.

Your task is NOT summarization. Your task is semantic intent extraction optimized for similarity search.

Analyze and infer the following:
1. The primary dominant tone of the text (e.g. sarcastic, ironic, frustrated, confident, chaotic, wholesome, deadpan).
2. The underlying emotions driving the message, including implicit emotions (e.g. confusion, superiority, anxiety, excitement, disbelief, apathy).
3. The situational context — what real-world or internet scenario this text represents (e.g. fake expertise, indecision, overconfidence, expectation vs reality, social pressure).

Guidelines:
- Infer meaning even if it is implied, not explicitly stated.
- Focus on semantic clarity rather than verbosity.
- Use language suitable for vector embeddings and similarity matching.
- Avoid narrative or conversational phrasing.

Return the output strictly in the following JSON format:

{
  "tone": "<primary dominant tone>",
  "emotions": "<comma-separated list of key emotions>",
  "context": "<concise semantic description of the scenario suitable for meme matching>"
}
`,
    })
    const embeddings = await generateEmbeddings(text)
    try {
        const result = await pineconeIndex.query({
            topK: 10,
            vector: embeddings,
        })
        const ids = result.matches?.map((match) => match.id) || []
        const template_urls: any[] = []
        for(const id of ids){
            const {data, error} = await supabase
            .from('templates').select('url').eq('id', id);
            if(error){
                console.log("Error in fetching template url from supabase for id ", id, " -> ", error)
                break
            }
            // // console.log(data)
            // if(data){
            //     console.log(data)
            // }
            template_urls.push(data[0])
        }
        return {
            success : true,
            data : template_urls,
            error : null
        }
    } catch (error) {
        return {
            success : false,
            data : null,
            error : error
        }
    }
}