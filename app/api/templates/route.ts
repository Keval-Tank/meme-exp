import { NextRequest, NextResponse } from 'next/server'
import { indexData } from '@/app/actions/index-data'
import { getRedisClient } from '@/lib/redis'


export async function POST(request: NextRequest) {
    try {
        const client = await getRedisClient();
        const clientIp = request.headers.get("x-client-ip") || "unknown";
        const record = await client.get(clientIp);
        if (!record) {
            console.log("New Entry -> ", clientIp)
            await client.set(clientIp, JSON.stringify({ visited: 1, requestDate: new Date().toISOString() }));
        } else {
            const data = JSON.parse(record);
            if (data.visited >= 10) {
                const currDate = new Date();
                const requestDate = new Date(data.requestDate);
                if (((currDate.getTime() - requestDate.getTime()) > 24 * 60 * 60 * 1000)) {
                    await client.set(clientIp, JSON.stringify({ visited: 1, requestDate: currDate.toISOString() }));
                    client.destroy();
                } else {
                    client.destroy();
                    return NextResponse.json(
                        { error: 'Rate limit exceeded. Please try again later.' },
                        { status: 429 }
                    )
                }
            }else {
                const currentDate = new Date();
                console.log("update -> ", clientIp, JSON.stringify({ visited: data.visited + 1, requestDate: currentDate.toISOString() }))
                await client.set(clientIp, JSON.stringify({ visited: data.visited + 1, requestDate: currentDate.toISOString() }));
                client.destroy();
            }
        }

        const body = await request.json()
        const { user_prompt } = body

        if (!user_prompt || typeof user_prompt !== 'string') {
            return NextResponse.json(
                { error: 'user_prompt is required and must be a string' },
                { status: 400 }
            )
        }

        const templateData = await indexData(user_prompt)

        if (!templateData) {
            return NextResponse.json(
                { error: 'Failed to fetch template data' },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { success: true, data: templateData },
            { status: 200 }
        )
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
