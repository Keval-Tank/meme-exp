import { supabase } from "../../lib/supabaseClient";
import { AppError } from "../../utils/error";

export async function signUpService(userData : {fullName : string, email:string, password:string}){
    try {
        const {email, password, fullName} = userData
        if(!email || !password || !fullName){
            throw new AppError("Missing input data", 400)
        }
        const {data : signUpData, error} = await supabase.auth.signUp({
            email,
            password,
            options : {
                data : {full_name : fullName}
            }
        })
        if (error) throw error
        return signUpData
    } catch (error) {
        throw error
    }
}

export async function signInService(data: { email: string; password: string }) {
    const { email, password } = data;
    try {
        if(!email || !password){
            throw new AppError("Missing input data", 400)
        }
        const { data: signInData, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return signInData;
    } catch (error) {
        throw error;
    }
}

export async function signOutService() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { message: "Signed out successfully" };
    } catch (error) {
        throw error;
    }
}