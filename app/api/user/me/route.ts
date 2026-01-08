import { NextRequest, NextResponse } from "next/server"
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken"
import { prisma } from "@/lib/prisma"
import { JWTExpired } from "jose/errors"
import { cookies } from "next/headers"
import { refreshTokens } from "@/app/actions/refresh-tokens"

export async function GET(req: NextRequest) {
  try {
    const tokenCookie = req.cookies.get("token")?.value
    if (!tokenCookie) return NextResponse.json({ success: false }, { status: 401 })

    const secret = process.env.JWT_ACCESS_TOKEN_SECRET!
    let payload: any
    try {
      payload = jwt.verify(tokenCookie, secret) as { id: number; sessionId: string }
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        const cookieStore = await cookies()
        const sessionIdCookie = cookieStore.get('ssid')
        if (!sessionIdCookie) {
          return NextResponse.json({
            success: false,
            error: 'sessionId not found'
          })
        }
        const sessionIdSecret = process.env.JWT_SESSION_ID_SECRET!
        const sessionId = jwt.verify(sessionIdCookie.value as string, sessionIdSecret) as JwtPayload
        const renewal = await refreshTokens(sessionId.sessionId)
        if (renewal.success) {
          const userData = await prisma.session.findFirst({
            where: {
              id: sessionId.sessionId
            },
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  role: true,
                  subscription: true,
                  sessionId: true
                }
              }
            }
          })
          return NextResponse.json({
            success: true,
            user: {
              name: userData?.user.name,
              email: userData?.user.email,
              role: userData?.user.role,
              subscription: userData?.user.subscription,
              sessionId: userData?.user.sessionId
            }
          })
        }
      } else {
        return NextResponse.json({ success: false }, { status: 401 })
      }
    }

    const session = await prisma.session.findUnique({
      where: { id: payload.sessionId },
      include: { user: true }
    })
    if (!session || session.user.id !== payload.id) return NextResponse.json({ success: false }, { status: 401 })

    const user = session.user
    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
        sessionId: session.id
      }
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}