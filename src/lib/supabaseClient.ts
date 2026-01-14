import { createClient } from "@supabase/supabase-js";

const supabase_project_url = process.env.SUPABASE_PROJECT_URL
const supabase_publishable_key= process.env.SUPABASE_SERVICE_KEY

let supabaseClient
if(!supabase_project_url || !supabase_publishable_key){
    throw new Error("Supabase credentials are missing")
}

export const supabase = createClient(supabase_project_url, supabase_publishable_key)
