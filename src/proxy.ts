import { NextRequest, NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";

const supabaseProjectUrl = process.env.SUPABASE_PROJECT_URL
if (!supabaseProjectUrl) {
  console.log("Supabase project url not found")
}

const JWKS = createRemoteJWKSet(
  new URL(`${supabaseProjectUrl}/auth/v1/.well-known/jwks.json`)
)

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  console.log("middleware called on request -> ", pathname)
  // Protected routes
  const protectedRoutes = ['/dashboard', '/template']
  const isProtected = protectedRoutes.some((route: string) =>
    pathname.startsWith(route)
  )

  if (!isProtected) {
    return NextResponse.next()
  }

  // Get tokens from cookies
  const accessToken = req.cookies.get('sb-access-token')?.value
  const refreshToken = req.cookies.get('sb-refresh-token')?.value

  // No tokens - redirect to login
  if (!accessToken && !refreshToken) {
    console.log('No tokens found, redirecting to login')
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  if (accessToken === undefined || refreshToken === undefined) {
    console.log('No tokens found, redirecting to login')
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  try {
    // Try to verify access token
    const { payload } = await jwtVerify(accessToken as string, JWKS , {
      issuer : `${supabaseProjectUrl}/auth/v1`,
      audience : 'authenticated'
    })
    console.log('Authorized user:', payload.email)
    const response = NextResponse.next()
    return response
  } catch (error: any) {
    console.log('Failed to verify token')
    console.log(error.message, error.code)

    if (!refreshToken) {
      console.log('No refresh token, unauthorized')
      const response = NextResponse.redirect(new URL('/auth', req.url))
      response.cookies.delete('sb-access-token')
      response.cookies.delete('sb-refresh-token')
      return response
    } else {
      console.log("have a refresh token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/renew`, {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        }
      })
      if(!response.ok){
        console.log("Failed to renew tokens")
      }else{
        const data = await response.json()
        const res = NextResponse.next();
        const accessToken = data.newAccessToken
        const refreshToken = data.newRefreshToken
        const expiresIn = data.expireIn

        if(!accessToken || !refreshToken || !expiresIn){
          return NextResponse.json({error : "renewal data not found"})
        }

        res.cookies.delete('sb-access-token')
        res.cookies.delete('sb-refresh-token')

        res.cookies.set('sb-access-token', accessToken, {
          httpOnly : true,
          sameSite : 'lax',
          path : '/',
          maxAge : expiresIn
        })

        res.cookies.set('sb-refresh-token', refreshToken, {
          httpOnly : true,
          sameSite : 'lax',
          path : '/',
          maxAge : 1000*60*60*24
        })

        return res
      }
    }
    
    const response = NextResponse.redirect(new URL('/auth', req.url))
    response.cookies.delete('sb-access-token')
    response.cookies.delete('sb-refresh-token')
    return response
  }
}

export const config = {
  matcher: [
    '/((?!login|signup|auth|_next/static|_next/image|favicon.ico|public).*)'
  ]
}