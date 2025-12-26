// Import the Pinecone library
import { Pinecone } from '@pinecone-database/pinecone'

// Initialize a Pinecone client with your API key
export const pinecone = new Pinecone({
    apiKey : process.env.PINECONE_API_KEY!
})

export const pineconeIndex = pinecone.index('meme-templates')

