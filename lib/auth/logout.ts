"use server"
import { prisma } from "../prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

interface LogoutResponse {
    success: boolean
    error?: string
}

export async function logout(): Promise<LogoutResponse> {
    try {
        const cookieStore = await cookies()
        const tokenCookie = cookieStore.get("token")

        if (!tokenCookie?.value) {
            return {
                success: false,
                error: "No token cookie found"
            }
        }

        const secret = process.env.JWT_ACCESS_TOKEN_SECRET
        if (!secret) {
            // clear cookie if server misconfigured
            cookieStore.delete("token")
            return {
                success: false,
                error: "Server configuration error: missing JWT secret"
            }
        }

        let payload: any
        try {
            payload = jwt.verify(tokenCookie.value, secret) as { id?: number | string; sessionId?: string }
        } catch (jwtError) {
            // invalid token — clear cookie and return
            cookieStore.delete("token")
            return {
                success: false,
                error: "Invalid token"
            }
        }

        const userId = typeof payload.id === "string" ? Number(payload.id) : payload.id
        const sessionId = payload.sessionId

        if (!userId || !sessionId) {
            // malformed payload — clear cookie and return
            cookieStore.delete("token")
            return {
                success: false,
                error: "Token payload missing required fields"
            }
        }

        // Delete session row (use deleteMany to avoid throw if missing)
        try {
            await prisma.session.deleteMany({
                where: { id: sessionId }
            })
        } catch (e) {
            console.error("Error deleting session:", e)
            // continue — still attempt to clear user and cookie
        }

        // Clear sessionId on user record (use updateMany to avoid throw if user missing)
        try {
            await prisma.user.updateMany({
                where: { id: userId },
                data: { sessionId: null }
            })
        } catch (e) {
            console.error("Error clearing user.sessionId:", e)
        }

        // Remove token cookie
        cookieStore.delete("token")

        return {
            success: true,
        }
    } catch (error) {
        console.error("Logout error:", error)
        try {
            (await cookies()).delete("token")
        } catch {}
        return {
            success: false,
            error: "Failed to logout"
        }
    }
}