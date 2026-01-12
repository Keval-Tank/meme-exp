import { betterAuth } from "better-auth";
import { prisma } from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {emailOTP} from 'better-auth/plugins'
import { sendSignInEmail } from "../services/sendEmail";
import dotenv from 'dotenv'
import { getRedisClient } from "./redis";

dotenv.config()

const redis = await getRedisClient()

export const auth = betterAuth({
    baseURL : process.env.BACKEND_URL,
    basePath : '/api/auth',
    database:prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }), 
    trustedOrigins : [process.env.FRONTEND_URL!],
    secret : process.env.BETTER_AUTH_SECRET,
        rateLimit: {
        enabled : true,
        window : 60,
        max : 100,
       customRules : {
        "/email-otp/send-verification-otp" : {
            window : 60,
            max : 3
        },
        "/sign-in/social" : {
            window : 60,
            max : 5
        }
       },
       customStorage :{
        get : async(key:string ) => {
            try{
                const record = await redis.get(key)
                if(record){
                    const data : {key:string, count : number, lastRequest :number} = JSON.parse(record)
                    return data
                }
                return undefined
            }catch(error){
                return undefined
            }
        },
        set : async(key:string, value:{ key: string; count: number; lastRequest: number; }) => {
            try{
                 if (!value || typeof value.count !== 'number' || typeof value.lastRequest !== 'number') {
                        throw new Error("Invalid rate limit data");
                    }
                    const existing = await redis.get(key);
                    let data = value;
                    if (existing) {
                        const parsed = JSON.parse(existing);
                        if (parsed && typeof parsed.count === 'number' && parsed.count < 100) { // Assuming max is 100 or from rules
                            data = { ...parsed, count: parsed.count + 1, lastRequest: value.lastRequest };
                        }
                    }
                     await redis.set(key, JSON.stringify(data));
            }catch(error){
                console.log("failed to store data, ", key)
                throw error
            }
        },
        del : async(key:string) => {
            try{
                await redis.del(key)
            }catch(error){
                console.log("Failed to delete key ," ,key)
            }
        }
       }
    },
    session : {
        cookieCache : {
            enabled : true,
            maxAge : 60*60*24*7
        }
    },
    socialProviders : {
        google : { 
            clientId : process.env.GOOGLE_CLIENT_ID!,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET,
            redirectURI : `${process.env.BACKEND_URL}/api/auth/callback/google`
        }
    },
    plugins : [
        emailOTP({
            async sendVerificationOTP({email, otp} : {email:string, otp:string}) {
                const response = await sendSignInEmail(email, otp)
                if(!response.success){
                    console.log("Failed to send email")
                    throw new Error(response.error || "Failed to send OTP")
                }
                console.log(`Sign in email sent : ${response.id}`)
            },
            otpLength : 6,
            expiresIn : 300
        })
    ]
});