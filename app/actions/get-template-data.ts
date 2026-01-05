import type { Template } from "@/lib/features/memes-templates-store/memesThunk"

export async function getTemplateData(user_prompt: string): Promise<Template[] | null> {
    try {
        const response = await fetch('/api/templates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_prompt })
        })

        if (!response.ok) {
            const error = await response.json()
            console.error('API Error:', error)
            return null
        }

        const data = await response.json()
        return data.data as Template[]
    } catch (error) {
        console.error('Failed to fetch template data:', error)
        return null
    }
}
