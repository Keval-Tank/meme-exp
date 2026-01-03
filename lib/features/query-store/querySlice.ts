import { createSlice } from "@reduxjs/toolkit";
import { generateQueryThunk } from "./queryThunk";

interface QueryState {
    data: any | null;
    loading: boolean;
    error: string | null | undefined;
}

const initialState: QueryState = {
    data: null,
    loading: false,
    error: null,
};

export const querySlice = createSlice({
    name: 'generateQuery',
    initialState,
    reducers: {
        // resetQuery: (state) => {
        //     state.data = null;
        //     state.error = null;
        //     state.loading = false;
        // },
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateQueryThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateQueryThunk.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(generateQueryThunk.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
                state.data = null;
            });
    },
});

// export const { resetQuery } = querySlice.actions;
export default querySlice.reducer;
