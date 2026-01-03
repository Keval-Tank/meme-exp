"use client"
import { createAsyncThunk } from "@reduxjs/toolkit";
import { generateQuery } from "@/app/actions/generate-query";

export const generateQueryThunk = createAsyncThunk(
    'query/generateQuery',
    async (userInput: string, { rejectWithValue }) => {
        try {
            const result = await generateQuery(userInput);
            return result;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to generate query');
        }
    }
);
