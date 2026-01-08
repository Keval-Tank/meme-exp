import { createAsyncThunk } from "@reduxjs/toolkit";

// Define interface here instead of importing from page
interface LoginFormValues {
    email: string;
    password: string;
}

interface LoginResponse {
    success: boolean;
    userId?: number;
    sessionId?: string;
    msg?: string;
}

export const userThunk = createAsyncThunk(
    'user/fetchUser',
    async (_, thunkAPI) => {
        try {
      const res = await fetch("/api/user/me", { method: "GET", credentials: "include" })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Fetch failed" }))
        return thunkAPI.rejectWithValue(err)
      }
      const data = await res.json()
      return data.user // { id, name, email, role, subscription, sessionId }
    } catch (e) {
      return thunkAPI.rejectWithValue({ error: "Network error" })
    }
    }
);