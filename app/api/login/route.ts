import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth/login";
import jwt from 'jsonwebtoken'

export async function POST(req : NextRequest) {
    // const {formValues} = await req.json()
    // console.log("req -> ", req)
    // console.log("Form values from route -> ", formValues)
    const body = await req.json()
    const {formValues} = body;
    const loginData = await login(formValues)
    console.log("login data -> ", loginData)

    if(loginData.success){
        const secret = process.env.JWT_SESSION_ID_SECRET
        const payload = {
            sessionId : loginData.sessionId
        }
        const signedSessionId = jwt.sign(payload, secret!)
        const response = NextResponse.json({
            msg : "Logged in"
        })
        response.cookies.set('sid', signedSessionId)
        return response
    }

    return NextResponse.json({
        msg : "Failed to login"
    })
}