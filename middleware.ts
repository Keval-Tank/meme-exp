import { type NextRequest, NextResponse } from "next/server";

const register = new Map<string, {visited : number, requestDate : Date, hour : number}>();

export default function middleware(req: NextRequest) {
    const urlKey = req.url.split("?")[0]; // Consistent key

    // console.log("req url -> ", req.url)
    if (!register.has(urlKey)) {
        const requestHour = new Date().getHours()
        const createdAt = new Date()
        register.set(urlKey, {visited:1, requestDate :createdAt, hour : requestHour});
        console.log("New entry");
        return NextResponse.next();
    }
    
    const {visited, requestDate, hour} = register.get(urlKey)!;
    
    if (visited >= 10) {
        const reTryIn = new Date().getHours().toString()
        const reTryDate = new Date().toString()
        console.warn("retry after -> ", {day : reTryDate, reTryIn : (hour+24)%24})
        return NextResponse.json({
            msg : "Rate limit reached",
            retry_in : `Retry after ${reTryIn} of ${reTryDate}`
        })
    }
    const currentDate = new Date();
    const currentHour = new Date().getHours()
    console.log("rate limit -> ", register);
    register.set(urlKey, {visited : visited+1, requestDate : currentDate, hour : currentHour});
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/api/templates/:path*',
        "/((?!_next/static|_next/image|favicon.ico).*)"
    ]
}
