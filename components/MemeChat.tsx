"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface Message {
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

interface MemeChatProps {
    onCustomize: (message: string, conversationHistory: Message[]) => Promise<string | void>
    isLoading?: boolean
}

export default function MemeChat({ onCustomize, isLoading = false }: MemeChatProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isProcessing) return

        const userMessage: Message = {
            role: "user",
            content: input.trim(),
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsProcessing(true)

        try {
            const response = await onCustomize(userMessage.content, [...messages, userMessage])
            if (response) {
                const assistantMessage: Message = {
                    role: "assistant",
                    content: response,
                    timestamp: new Date()
                }
                setMessages(prev => [...prev, assistantMessage])
            }
        } catch (error) {
            console.error("Error customizing captions:", error)
            const errorMessage: Message = {
                role: "assistant",
                content: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsProcessing(false)
        }
    }


    return (
        <div className="flex flex-col h-[300px] border border-gray-300 rounded-lg bg-white">
            <div className="p-3 border-b bg-gray-50">
                <h3 className="font-semibold text-sm">Customize Captions</h3>
                <p className="text-xs text-gray-600">Chat with AI to customize this meme</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-8">
                        Start a conversation to customize your meme captions!
                        <br />
                        <span className="text-xs">Try: "Make them funnier" or "Make it about coding"</span>
                    </div>
                )}
                
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                message.role === "user"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-800"
                            }`}
                        >
                            <p className="text-sm">{message.content}</p>
                        </div>
                    </div>
                ))}
                
                {isProcessing && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 rounded-lg px-4 py-2">
                            <p className="text-sm text-gray-600">Thinking...</p>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isProcessing}
                    className="flex-1"
                />
                <Button type="submit" disabled={isProcessing || !input.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    )
}


