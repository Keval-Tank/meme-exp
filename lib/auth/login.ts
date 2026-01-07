"use server"
import bcrypt from "bcryptjs"
import { prisma } from "../prisma"
import { v4 as uuidv4 } from "uuid"
import jwt from "jsonwebtoken"

interface LoginData {
    email: string
    password: string
}

interface LoginResponse {
    success: boolean
    userEmail?: number | string
    sessionId?: string
    error?: string
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
                email: true,
                password: true,
                sessionId: true,
                id: true
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
        let sessionId
        if (!user.sessionId) {
            sessionId = uuidv4();
        } else {
            sessionId = user.sessionId
        }
        const payload = {
            id: user.id,
            sessionId: sessionId
        }
        const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET!
        const accessToken = jwt.sign(payload, accessTokenSecret)

        // Update user with new session ID
        await prisma.user.update({
            where: { email: user.email},
            data: { 
                sessionId,
                accessToken
            }
        })
        
        // console.log("updated data -> ", updated)

        return {
            success: true,
            userEmail: user.email,
            sessionId
        }
    } catch (error) {
        console.error("Login error:", error)
        return {
            success: false,
            error: "Failed to login"
        }
    }
}