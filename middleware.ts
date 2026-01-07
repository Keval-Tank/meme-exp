import { type NextRequest, NextResponse } from "next/server";
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
    if(!req.headers.get('sid')){
        console.log('sid -> ', req.headers.get('sid'))
        return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/search-template/:path*',
        '/text-to-meme',
        '/text-to-visuals',
        '/api/:path*',
        '/admin/:path*',
        '/actions/:path*',
        '/api/templates/:path*',
    ]
}
