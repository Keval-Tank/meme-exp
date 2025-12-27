"use client"
import { createSlice } from "@reduxjs/toolkit"
import { fetchTemplates } from "./memesThunk"

interface Template {
    caption_areas : number
    height : number
    name : string
    url : string
    width : number
}

interface states {
    templates : Array<Template> | null,
    loading : boolean,
    error : string | null
}

const initialStates : states = {
    templates : [],
    loading : false,
    error : null
}

export const memeTemplateSlice = createSlice({
    name : "fetched templates",
    initialState : initialStates,
    reducers : {

    },
    extraReducers : (builder) => {
        builder
            .addCase(fetchTemplates.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchTemplates.fulfilled, (state, action) => {
                state.templates = action.payload
                state.loading = false
            })
            .addCase(fetchTemplates.rejected, (state, action) => {
                state.error = action.payload as string,
                state.loading = false
            })
    }
})

export default memeTemplateSlice.reducer