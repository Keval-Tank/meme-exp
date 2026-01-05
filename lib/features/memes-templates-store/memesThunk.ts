import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTemplateData } from "@/app/actions/get-template-data";

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
        const result = await getTemplateData(prompt);
        if (!result) {
            console.log("Results not found")
            return thunkAPI.rejectWithValue("Results not found")
        }
        return result
    } catch (error) {
        return thunkAPI.rejectWithValue("Error occurred while fetching result")
    }
})