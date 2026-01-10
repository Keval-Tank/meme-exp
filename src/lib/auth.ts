import { betterAuth } from "better-auth";
import { prisma } from "./prisma";
import {emailOTP} from 'better-auth/plugins'
import { sendSignInEmail } from "../services/sendEmail";

export const auth = betterAuth({
    database: prisma,
    socialProviders : {
        google : {
            clientId : process.env.GOOGLE_CLIENT_ID!,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET
        }
    },
    plugins : [
        emailOTP({
            async sendVerificationOTP({email, otp} : {email:string, otp:string}) {
                const response = await sendSignInEmail(email, otp)
                if(!response.success){
                    throw new Error(response.error || "Failed to send OTP")
                }
                console.log(`Sign in email sent : ${response.id}`)
            },
            otpLength : 6,
            expiresIn : 300
        })
    ]
});