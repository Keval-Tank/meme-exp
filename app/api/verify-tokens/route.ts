import { NextRequest, NextResponse } from "next/server";
// import { login } from "@/lib/auth/login";
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken'
import { getRedisClient } from "@/lib/redis";
import { JWTExpired } from "jose/errors";
import { refreshTokens } from "@/app/actions/refresh-tokens";
import { cookies } from "next/headers";

interface TokenPayload {
    id: number,
    sessionID: string,
    iat?: number
}

export async function POST(req: NextRequest) {
    // const {formValues} = await req.json()
    // console.log("req -> ", req)
    // console.log("Form values from route -> ", formValues)
    // const body = await req.json()
    // const {formValues} = body;
    // const loginData = await login(formValues)
    // console.log("login data -> ", loginData)

    // if(loginData.success){
    //     const secret = process.env.JWT_SESSION_ID_SECRET
    //     const payload = {
    //         sessionId : loginData.sessionId
    //     }
    //     const signedSessionId = jwt.sign(payload, secret!)
    //     const response = NextResponse.json({
    //         msg : "Logged in"
    //     })
    //     response.cookies.set('sid', signedSessionId)
    //     return response
    // }

    // return NextResponse.json({
    //     msg : "Failed to login"
    // })
    const body = await req.json()
    if (!body) {
        return NextResponse.json({
            success: false,
            error: 'body not found'
        })
    }
    // console.log("recieved body -> ", body)
    // const sessionSecretEncoded = new TextEncoder().encode(
    //     process.env.JWT_SESSION_ID_SECRET!
    // )
    // const tokenSecretEncoded = new TextEncoder().encode(
    //     process.env.JWT_ACCESS_TOKEN_SECRET!
    // )
    // const sessionId = jwt.verify(body.sid,process.env.JWT_SESSION_ID_SECRET!)
    try {
        const payload = jwt.verify(body.token, process.env.JWT_ACCESS_TOKEN_SECRET!) as JwtPayload
        // console.log("payload -> ", payload)
        // console.log("payload -> ",payload)
        const redis = await getRedisClient()
        const record = await redis.get(payload?.id.toString())
        if (!record) {
            redis.destroy()
            return NextResponse.json({
                success: false,
                error: "User not logged in"
            })
        }
        // console.log("record -> ", record)
        // console.log("user record -> ", record)
        const userData = JSON.parse(record)
        redis.destroy()
        
        // console.log(userData)
        if (userData.sessionId === payload.sessionId!) {
            // Check if admin verification is requested
            if (body.checkAdmin) {
                const isAdmin = userData.role?.toLowerCase() === 'admin'
                return NextResponse.json({
                    success: true,
                    data: 'authorized',
                    isAdmin
                })
            }
            return NextResponse.json({
                success: true,
                data: 'authorized'
            })
        }
        console.log("Unauthorized")
        return NextResponse.json({
            success: false,
            data: 'Unauthorized'
        })
    } catch (error) {
        // if (error instanceof TokenExpiredError) {
        //     const cookieStore = await cookies()
        //     const sessionIdCookie = cookieStore.get('ssid')
        //     if (!sessionIdCookie) {
        //         return NextResponse.json({
        //             success: false,
        //             error: 'sessionId not found'
        //         })
        //     }
        //     const sessionIdSecret = process.env.JWT_SESSION_ID_SECRET!
        //     const sessionId = jwt.verify(sessionIdCookie.value as string, sessionIdSecret) as JwtPayload
        //     console.log("SessionId for renewal -> ", sessionId)
        //     const renewal = await refreshTokens(sessionId.ssid)
        //     if (renewal.success) {
        //         console.log("token renewed")
        //         return NextResponse.json({
        //             success: true,
        //             msg: 'token renewed'
        //         })
        //     } else {
        //         console.log("failed to renew tokens")
        //         return NextResponse.json({
        //             success: false,
        //             error: "failed to renew tokens"
        //         })
        //     }
        // } else {
        //     console.log("Failed to renew token")
        //     return NextResponse.json({
        //         success: false,
        //         error: 'Failed to renew token'
        //     })
        // }
        return NextResponse.json({
                success: false,
                error: 'Failed to renew token'
            })
    }
}