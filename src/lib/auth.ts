import { betterAuth } from "better-auth";
import { prisma } from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {emailOTP} from 'better-auth/plugins'
import { sendSignInEmail } from "../services/sendEmail";

export const auth = betterAuth({
    baseURL : process.env.BACKEND_URL,
    basePath : '/api/auth',
    database:prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }), 
    trustedOrigins : [process.env.FRONTEND_URL!],
    secret : process.env.BETTER_AUTH_SECRET,
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