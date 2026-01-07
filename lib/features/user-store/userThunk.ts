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
    'user/login',
    async (formValues: LoginFormValues, thunkAPI) => {
        try {
            if (!formValues || !formValues.email || !formValues.password) {
                console.log("❌ Missing form values");
                return thunkAPI.rejectWithValue({ error: "Cannot find form values" });
            }

            console.log("🚀 Sending to API:", formValues);

            const response = await fetch('/api/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    formValues: {
                        email: formValues.email,
                        password: formValues.password
                    }
                }),
                credentials: 'include'
            });

            const responseData: LoginResponse = await response.json();
            console.log("📦 API Response:", responseData);

            // Handle API errors
            if (!response.ok || !responseData.success) {
                return thunkAPI.rejectWithValue({ 
                    error: responseData.msg || "Login failed" 
                });
            }

            // Return API response, not formValues
            return responseData;

        } catch (error) {
            console.error("❌ Thunk error:", error);
            return thunkAPI.rejectWithValue({ error: "Network error" });
        }
    }
);