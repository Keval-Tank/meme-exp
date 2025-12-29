"use client"
import { createSlice } from "@reduxjs/toolkit"
import { fetchTemplates } from "./memesThunk"
import { Template } from "./memesThunk"

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
    name : "fetched_templates",
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