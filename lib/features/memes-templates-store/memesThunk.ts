import { createAsyncThunk } from "@reduxjs/toolkit";
import { indexData } from "@/app/actions/index-data";
import { groq } from "@ai-sdk/groq"

export interface Template {
    id?: string,
    name?: string,
    url?: string,
    width?: number,
    height?: number,
    box_count?: number,
    captions?: number,
    keywords?: string[],
    topics?: string[],
    tone?: string,
    description?: string,
    tags?: string[],
    meme_captions? : string[],
    caption_areas? : any[]
}

export const fetchTemplates = createAsyncThunk("fetchTemplateThunk/fetch", async (prompt: string, thunkAPI): Promise<any> => {
    try {
        const result = await indexData(prompt);
        if (!result) {
            console.log("Results not found")
            return thunkAPI.rejectWithValue("Results not found")
        }
        return result
    } catch (error) {
        return thunkAPI.rejectWithValue("Error ocurred while fetching result")
    }
})