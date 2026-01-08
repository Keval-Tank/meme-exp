import { type NextRequest, NextResponse } from "next/server";
import {jwtVerify} from 'jose'
// import { getRedisClient } from "./lib/redis";

// const register = new Map<string, { visited: number, requestDate: Date, hour: number }>();

// async function checkCanMakeRequest(urlKey: string): Promise<boolean> {
//     const client = await getRedisClient();
//     const record = await client.get(urlKey);
//     if (!record) {
//         await client.set(urlKey, JSON.stringify({ visited: 1, requestDate: new Date().toISOString() }));
//         client.destroy();
//         return true;
//     }
//     const data = JSON.parse(record);
//     if (data.visited >= 10) {
//         const currDate = new Date();
//         const requestDate = new Date(data.requestDate);
//         if (((currDate.getTime() - requestDate.getTime()) > 24 * 60 * 60 * 1000)) {
//             await client.set(urlKey, JSON.stringify({ visited: 1, requestDate: currDate.toISOString() }));
//             client.destroy();
//             return true;
//         }
//         client.destroy();
//         return false;
//     }
//     client.destroy();
//     return true;
// }


const register = new Map<string, { visited: number, requestDate: Date, hour: number }>();

export default async function middleware(req: NextRequest) {
    // const urlKey = req.url.split("?")[0]; // Consistent key

    // // console.log("req url -> ", req.url)
    // if (!register.has(urlKey)) {
    //     const requestHour = new Date().getHours()
    //     const createdAt = new Date()
    //     register.set(urlKey, { visited: 1, requestDate: createdAt, hour: requestHour });
    //     console.log("New entry");
    //     return NextResponse.next();
    // }

    // const { visited, requestDate, hour } = register.get(urlKey)!;
    // if (visited >= 2) {
    //     const currDate = new Date();
    //     const currHour = new Date().getHours();
    //     // Can make 2 requests per hour
    //     if (!((currDate.getTime() - requestDate.getTime()) > 60 * 60 * 1000) || !(currHour !== hour && (currHour + 24 - hour) % 24 >= 1)) {
    //         console.warn("Hourly rate limit exceeded for ", urlKey);
    //         return NextResponse.json({ msg: "Hourly rate limit exceeded. Please try again later.", status: 429 });
    //     }
    //     return NextResponse.next();
    // }

    // if (visited >= 10) {
    //     const currDate = new Date();
    //     const currHour = new Date().getHours()
    //     // Make request after 24 hours
    //     if (!((currDate.getTime() - requestDate.getTime()) > 24 * 60 * 60 * 1000) || !(currHour !== hour && (currHour + 24 - hour) % 24 >= 24)) {
    //         // register.set(urlKey, {visited:1, requestDate : currDate, hour : currHour});
    //         // console.log("Resetting count after 24 hours");
    //         return NextResponse.redirect("/too-many-requests");
    //     }
    //     return NextResponse.next();
    // }
    // const currentDate = new Date();
    // const currentHour = new Date().getHours()
    // console.log("rate limit -> ", register);
    // register.set(urlKey, { visited: visited + 1, requestDate: currentDate, hour: currentHour });
    // return NextResponse.next();
    // const clientIp = req.headers.get("x-forwarded-for") ?? "unknown";
    // const ip = clientIp.split(":")[clientIp.split(":").length - 1];
    // console.log("client ip -> ", clientIp)
    // console.log("Client IP -> ", ip);
    // const response = await fetch("/api/check-can-make-request", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({ clientIP: clientIp.split(":")[clientIp.split(":").length - 1] })
    // });
    // const data = await response.json();
    // if (!data.can) {
    //     return NextResponse.redirect("/too-many-requests");
    // }
    // const response = NextResponse.next();
    // response.headers.set("X-Client-IP", ip);
    // return response;
    // 

    // const authSessionId = req.cookies.get('sid')
    const authToken = req.cookies.get('token')
    if(!authToken?.value){
        return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    const response = await fetch(`${process.env.BASE_URL}/api/verify-tokens`, {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({token : authToken.value})
    })
    const data = await response.json()
    if(data.success){
        return NextResponse.next()
    }
    // console.log("repsonse data -> ", data.success)
    // if(!data.success){
    //     return NextResponse.redirect(new URL('/auth/login', req.url))
    // }
    // const data = await response.json()
    // console.log("response from token vewrification -> ", data)
    // console.log("sid -> ", authCookie)
    // const sessionSecret = process.env.JWT_SESSION_ID_SECRET!
    // const tokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET!
    // const sessionSecretEncoded = new TextEncoder().encode(
    //     process.env.JWT_SESSION_ID_SECRET!
    // )
    // const tokenSecretEncoded = new TextEncoder().encode(
    //     process.env.JWT_ACCESS_TOKEN_SECRET!
    // )
    // const sessionId = await jwtVerify(authSessionId.value, sessionSecretEncoded)
    // const payload = await jwtVerify(authToken.value, tokenSecretEncoded)
    // console.log("sessionId -> ", sessionId)
    // console.log("payload -> ", payload)
    return NextResponse.redirect(new URL('/auth/login', req.url))
}

export const config = {
    matcher: [
        '/search-template/:path*',
        '/text-to-meme',
        '/text-to-visuals',
        // '/api/:path*',
        '/admin/:path*',
        '/actions/:path*',
        '/api/templates/:path*',
    ]
}
