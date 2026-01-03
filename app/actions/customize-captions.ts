"use server"
import { createGroq } from "@ai-sdk/groq"
import { generateText } from "ai"
import type { Template } from "@/lib/features/memes-templates-store/memesThunk"

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY!
})

export async function customizeCaptions(
    template: Template,
    chatMessage: string,
    conversationHistory: Array<{ role: "user" | "assistant", content: string }> = []
): Promise<{ template: Template, response: string } | null> {
    try {
        // Build conversation context
        const conversationContext = conversationHistory
            .map(msg => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
            .join("\n")

        const prompt = `You are an expert meme caption writer. A user is chatting with you to customize meme captions.

CONVERSATION HISTORY:
${conversationContext}

CURRENT USER REQUEST: "${chatMessage}"

TEMPLATE INFORMATION:
- Name: ${template.name}
- Description: ${template.description || "N/A"}
- Tone: ${template.tone || "humorous"}
- Number of caption areas: ${template.box_count || template.meme_captions?.length || 1}
- Current captions: ${template.meme_captions?.join(" | ") || "None"}

RULES (CRITICAL - FOLLOW EXACTLY):
✓ MAXIMUM 3-5 words per caption
✓ Simple, easy-to-understand English
✓ Align with template's meme mechanics
✓ Match the ${template.tone || "humorous"} tone
✓ Make it funny and relevant to the user's chat request
✓ Output captions ONLY, separated by "|"
✓ No explanations, hashtags, or extra text
✓ Consider the conversation context when generating captions

Generate new captions based on the user's chat request and conversation history.

Output Format (STRICT - captions only, separated by |):`

        const { text } = await generateText({
            model: groq('moonshotai/kimi-k2-instruct-0905'),
            prompt: prompt
        })

        const newCaptions = text.split("|").map(caption => caption.trim()).filter(caption => caption.length > 0)
        
        const updatedTemplate: Template = {
            ...template,
            meme_captions: newCaptions.length > 0 ? newCaptions : template.meme_captions
        }

        // Generate AI response
        const responsePrompt = `You are a helpful AI assistant helping users customize meme captions through conversation.

CONVERSATION HISTORY:
${conversationContext}

USER'S LATEST MESSAGE: "${chatMessage}"

You've just updated the captions for the "${template.name}" meme template based on the user's request. 
Respond in a friendly, conversational way acknowledging their request and confirming the captions have been updated.
Keep your response brief (1-2 sentences) and friendly.`

        const { text: aiResponse } = await generateText({
            model: groq('moonshotai/kimi-k2-instruct-0905'),
            prompt: responsePrompt
        })

        return {
            template: updatedTemplate,
            response: aiResponse
        }
    } catch (error) {
        console.log("Failed to customize captions -> ", error)
        return null
    }
}

