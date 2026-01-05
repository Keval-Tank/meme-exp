import { NextRequest, NextResponse } from 'next/server'
import { indexData } from '@/app/actions/index-data'

export async function POST(request: NextRequest) {
    try {
        console.log("request url -> ", request.url)
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
