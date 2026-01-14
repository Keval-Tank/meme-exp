import { supabase } from "../../lib/supabaseClient";
import { AppError } from "../../utils/error";

export async function signUpService(userData: { fullName: string, email: string, password: string }) {
    try {
        const { email, password, fullName } = userData
        if (!email || !password || !fullName) {
            throw new AppError("Missing input data", 400)
        }
        const { data: signUpData, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName }
            }
        })
        if (error) {
            console.log("Failed to signup -> ", error)
            throw error
        }
        const session = signUpData.session
        return {
            session
        }
    } catch (error) {
        console.log("sign up error -> ", error)
        throw error
    }
}

export async function signInService(data: { email: string; password: string }) {
    const { email, password } = data;
    try {
        if (!email || !password) {
            throw new AppError("Missing input data", 400)
        }
        const { data: signInData, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) {
            console.log("Failed to login -> ", error)
            throw error
        }
        const session = signInData.session
        return {
            session
        };
    } catch (error) {
        throw error;
    }
}

export async function signInWithGoogle() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${process.env.BACKEND_URL}/api/auth/callback`
            }
        })
        if (error || !data.url) {
            console.log("failed to get url -> ", error)
            throw error
        }
        return {
            url: data.url
        }
    } catch (error) {
        throw error
    }
}

export async function tokenExchange(code: string) {
    try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
            throw error
        }
        const session = data.session
        return {
            session
        }
    } catch (error) {
        throw error;
    }
}

export async function signOutService() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log("Failed to sign out -> ", error)
            throw error
        }
        return { message: "Signed out successfully" };
    } catch (error) {
        throw error;
    }
}
