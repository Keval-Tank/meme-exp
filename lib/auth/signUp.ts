"use server"
import bcrypt from "bcryptjs"
import {prisma} from "../prisma"
import {v4 as uuidv4} from "uuid"

interface SignUpData {
    name: string
    email: string
    password: string
}

interface SignUpResponse {
    success: boolean
    userId?: string | number
    error?: string
}

export async function signUp(data: SignUpData): Promise<SignUpResponse> {
    try {
        const { name, email, password } = data

        // Validate required fields
        if (!name || !email || !password) {
            return {
                success: false,
                error: "All fields are required"
            }
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: { email }
        })

        // console.log(existingUser)

        if (existingUser) {
            return {
                success: false,
                error: "Email already registered"
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)
        // const sessionId = uuidv4()
        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role : 'User' 
            }
        })

        return {
            success: true,
            userId: user.id
        }
    } catch (error) {
        console.error("SignUp error:", error)
        return {
            success: false,
            error: "Failed to create account"
        }
    }
}