import cors from "cors"

export const corsOptions = cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE'],
    credentials: true,
    allowedHeaders : ['Content-Type', 'Authorization']
})