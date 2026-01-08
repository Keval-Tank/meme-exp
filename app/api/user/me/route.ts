import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const tokenCookie = req.cookies.get("token")?.value
    if (!tokenCookie) return NextResponse.json({ success: false }, { status: 401 })

    const secret = process.env.JWT_ACCESS_TOKEN_SECRET!
    let payload: any
    try {
      payload = jwt.verify(tokenCookie, secret) as { id: number; sessionId: string }
    } catch (err) {
      return NextResponse.json({ success: false }, { status: 401 })
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