import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { userThunk } from "./userThunk"

type UserSubscription = {
    name: string
    email: string
    role: string
    loading: boolean,
    sessionId: string | null,
    subscription: "FREE" | "PRO" | "BYOK" | null,
    error: any | null
}

const initialState: UserSubscription = {
    name: '',
    email: '',
    role: '',
    loading: false,
    sessionId: null,
    subscription: "FREE",
    error: null
}

interface SetUserPayload {
    name: string
    email: string
    role: string
    sessionId: string
    subscription: "FREE" | "PRO" | "BYOK"
}

interface UpdateUserPayload {
    name?: string
    email?: string
    role?: string
    sessionId?: string
    subscription?: "FREE" | "PRO" | "BYOK"
}

export const userSlice = createSlice({
    name: "userSubscription",
    initialState,
    reducers: {
        // Set entire user state
        setUserState: (state, action: PayloadAction<SetUserPayload>) => {
            state.name = action.payload.name
            state.email = action.payload.email
            state.role = action.payload.role
            state.subscription = action.payload.subscription
            state.sessionId = action.payload.sessionId
            state.loading = false
            state.error = null
        },

        // Update partial user state
        updateUserState: (state, action: PayloadAction<UpdateUserPayload>) => {
            if (action.payload.name !== undefined) {
                state.name = action.payload.name
            }
            if (action.payload.email !== undefined) {
                state.email = action.payload.email
            }
            if (action.payload.role !== undefined) {
                state.role = action.payload.role
            }
            if (action.payload.subscription !== undefined) {
                state.subscription = action.payload.subscription
            }
            if (action.payload.sessionId !== undefined) {
                state.sessionId = action.payload.sessionId
            }
        },

        // Reset to initial state (logout/remove)
        removeUserState: (state) => {
            state.name = ''
            state.email = ''
            state.role = ''
            state.subscription = "FREE"
            state.sessionId = null
            state.loading = false
            state.error = null
        },

        // Set loading state
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },

        // Set error state
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
            state.loading = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(userThunk.pending, (state) => {
                state.email = "defaultMail"
                state.name = "defaultName"
                state.role = "User"
                state.sessionId = ""
                state.subscription = "FREE"
                state.error = null
                state.loading = true
            })
            .addCase(userThunk.fulfilled, (state, action) => {
                // console.log("thunk success")
                state.email = action.payload.email
                state.name = action.payload.name
                state.role = action.payload.role
                state.sessionId = action.payload.sessionId
                state.subscription = action.payload.subscription
                state.error = null
                state.loading = false
            })
            .addCase(userThunk.rejected, (state, action) => {
                state.name = ''
                state.email = ''
                state.role = ''
                state.subscription = "FREE"
                state.sessionId = null
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { setUserState, updateUserState, removeUserState } = userSlice.actions


export default userSlice.reducer