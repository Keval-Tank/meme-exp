import { createAsyncThunk } from "@reduxjs/toolkit";
import { indexData } from "@/app/actions/index-data";

export interface Template {
    caption_areas : number
    height : number
    name : string
    url : string
    width : number
}

export const fetchTemplates = createAsyncThunk("fetchTemplateThunk/fetch", async({},thunkAPI) : Promise<any> => {
    try{
        const result = await indexData();
        if(!result){
            return thunkAPI.rejectWithValue({message : "Result not found"})
        }
        return result
    }catch(error){
        return thunkAPI.rejectWithValue({message : "Failed to find templates", error})
    }
})