import { createSlice } from "@reduxjs/toolkit"
import { userThunk } from "./userThunk"

type UserSubscription = {
    name : string
    email : string
    role : string
    loading: boolean,
    subscription: "FREE" | "PRO" | "BYOK" | null,
    error: any | null
}

const initialState: UserSubscription = {
    name : '',
    email : '',
    role : '',
    loading: false,
    subscription: "FREE",
    error: null
}

export const userSlice = createSlice({
    name: "userSubscription",
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
            .addCase(userThunk.pending, (state) => {
                
                state.loading = true
            })
            .addCase(userThunk.fulfilled, (state, action) => {
                console.log("thunk success")
                state.email = action.payload.email
                state.loading = false
            })
            .addCase(userThunk.rejected, (state, action) => {
                console.log("thunk false -> ", action.payload)
                state.error = action.payload,
                state.loading = false
        })
    }
})

export default userSlice.reducer