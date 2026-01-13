import { betterAuth } from "better-auth";
import { prisma } from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import dotenv from 'dotenv'
import { getRedisClient } from "./redis";
import { custom_prisma_adapter } from "./customAdapter";

dotenv.config()

const redis = await getRedisClient()

export const auth = betterAuth({
    baseURL: process.env.BACKEND_URL,
    basePath: '/api/auth',
    database: custom_prisma_adapter(),
    trustedOrigins: [process.env.FRONTEND_URL!],
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
        minPasswordLength: 8,
        maxPasswordLength: 128
    },
    rateLimit: {
        enabled: true,
        window: 60,
        max: 10,
        customRules: {
            "/email-otp/send-verification-otp": {
                window: 60,
                max: 3
            },
            "/sign-in/social": {
                window: 60,
                max: 5
            }
        },
        customStorage: {
            get: async (key: string) => {
                try {
                    const record = await redis.get(key)
                    if (record) {
                        const data: { key: string, count: number, lastRequest: number } = JSON.parse(record)
                        return data
                    }
                    return undefined
                } catch (error) {
                    return undefined
                }
            },
            set: async (key: string, value: { key: string; count: number; lastRequest: number; }) => {
                try {
                    if (!value || typeof value.count !== 'number' || typeof value.lastRequest !== 'number') {
                        throw new Error("Invalid rate limit data");
                    }
                    await redis.set(key, JSON.stringify(value));
                } catch (error) {
                    console.log("failed to store data, ", key)
                    throw error
                }
            },
            del: async (key: string) => {
                try {
                    await redis.del(key)
                } catch (error) {
                    console.log("Failed to delete key ,", key)
                }
            }
        }
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24 * 7
        }
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            redirectURI: `${process.env.BACKEND_URL}/api/auth/callback/google`
        }
    }
});