"use server"
import bcrypt from "bcryptjs"
import { prisma } from "../prisma"
import { v4 as uuidv4 } from "uuid"
import jwt, { TokenExpiredError } from "jsonwebtoken"
import { cookies } from "next/headers"
import { getRedisClient } from "../redis"
import { JWTExpired } from "jose/errors"

interface LoginData {
    email: string
    password: string
}

interface LoginResponse {
    success: boolean
    userEmail?: number | string
    name? : string
    role? : string
    subscription? : string
    sessionId?: string
    error?: string
    sud? : string
}

export async function setCookies(name:string, value:string, path:string) {
    (await cookies()).set(name, value, {
        httpOnly : false,
        path
    })
}

export async function login(data: LoginData): Promise<LoginResponse> {
    try {
        const { email, password } = data
        // Validate required fields
        if (!email || !password) {
            return {
                success: false,
                error: "Email and password are required"
            }
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id : true,
                email : true,
                password : true
            }
        })

        if (!user) {
            return {
                success: false,
                error: "Invalid email or password"
            }
        }

        // Compare password
        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return {
                success: false,
                error: "Invalid email or password"
            }
        }

        // Generate new session ID
        const sessionId = uuidv4()
        const payload = {
            id: user.id,
            sessionId: sessionId
        }
        const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET!
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn : '1m'
        })
        const refreshToken = uuidv4()

        // Update user with new session ID
        const userSessionData = await prisma.session.create({
            data : {
                id : sessionId,
                accessToken,
                userId : user.id,
                refreshToken
            }
        })

        const updatedUserData = await prisma.user.update({
            where : {
                id : user.id
            },
            data : {
                sessionId
            },
            select:{
                id : true,
                name : true,
                subscription : true,
                role : true,
                sessionId : true
            }
        })
    
        const redis = await getRedisClient();
        await redis.setEx(updatedUserData.id.toString(), 60*60*24, JSON.stringify({
            subscription : updatedUserData.subscription,
            role : updatedUserData.subscription,
            sessionId,
            refreshToken : userSessionData.refreshToken 
        }))
        redis.destroy()
        // const sessionIdSecret = process.env.JWT_SESSION_ID_SECRET!
        // const signedSessionId = jwt.sign({sessionId}, sessionIdSecret)
        // console.log("updated data -> ", updated)
        // set cookies
        // await setCookies('sid', signedSessionId, '/')
        // const dataSecret = process.env.JWT_USER_DATA_SECRET!
        // const signedUserData = jwt.sign({
        //     userEmail: user.email,
        //     name : updatedUserData.name,
        //     role : updatedUserData.role,
        //     subscription : updatedUserData.subscription,
        //     sessionId
        // }, dataSecret)
        await setCookies('token', accessToken, '/')

        return {
            success: true,
            userEmail: user.email,
            name : updatedUserData.name,
            role : updatedUserData.role,
            subscription : updatedUserData.subscription,
            sessionId,
        }
    } catch (error) {
        return {
            success: false,
            error: "Failed to login"
        }
    }
}
