"use server"
import { prisma } from "@/lib/prisma"
import {v4 as uuidv4} from 'uuid'
import { getRedisClient } from "@/lib/redis"
import jwt from 'jsonwebtoken'
import { cookies } from "next/headers"

export async function refreshTokens(sessionId : string){
    try{
        console.log("sessionId -> ", sessionId)
        const sessionData = await prisma.session.findFirst({
            where : {
                id : sessionId
            }
        })
        if(!sessionData){
            throw new Error("Session data not found!")
        }
        const refreshToken = sessionData.refreshToken
        const redis = await getRedisClient()
        const record = await redis.get(sessionData.userId.toString())
        if(!record){
            throw new Error("Not Logged In")
        }
        const recordData = JSON.parse(record)
        if(recordData.refreshToken === refreshToken){
            const newRefreshToken = uuidv4()
            const secret = process.env.JWT_ACCESS_TOKEN_SECRET!
            const newAccessToken = jwt.sign({
                id : sessionData.userId,
                sessionId
            }, secret, {
                expiresIn : '1m'
            })
            const updatedSessionData = await prisma.session.update({
                where : {
                    id : sessionId
                },
                data : {
                    accessToken : newAccessToken,
                    refreshToken : newRefreshToken
                },
                include : {
                    user : {
                       select : {
                         subscription : true,
                         role : true,
                       }
                    }
                }
            })
            await redis.setEx(sessionData.userId.toString(), 60*60*24, JSON.stringify({
            subscription : updatedSessionData.user.subscription,
            role : updatedSessionData.user.role,
            sessionId,
            refreshToken : newRefreshToken
        }))
            const cookieStore = await cookies()
            cookieStore.delete('token')
            cookieStore.set('token', newAccessToken)
            return {
                success : true,
                data : 'token renewed'
            }
        }else{
            throw new Error("Invalid refresh token")
        }
    }catch(error){
        return {
            success : false,
            error : 'Failed to renew token'
        }
    }
}