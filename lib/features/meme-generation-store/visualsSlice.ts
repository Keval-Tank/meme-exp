import { createSlice } from "@reduxjs/toolkit";
import { fetchVisualThunk } from "./visualsThunk";

interface FetchVisual {
    data : any | null,
    loading : boolean,
    error : string | null | undefined 
}

const initialState : FetchVisual = {
    data : null,
    loading : false,
    error : null
}

export const visualSlice = createSlice({
    name : 'generated_visuals',
    initialState,
    reducers : {

    },
    extraReducers : (builder) => {
        builder
        .addCase(fetchVisualThunk.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchVisualThunk.fulfilled, (state, action) => {
            state.data = action.payload.data;
            state.loading = false
        })
        .addCase(fetchVisualThunk.rejected, (state, action) => {
            state.error = action.error.message
            state.loading = false
        })
    }
})

export default visualSlice.reducer