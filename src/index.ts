import express from "express"
import { corsOptions } from "./config/cors"
import { errorHandler, notFoundHandler } from "./middleware/errorHandler"
import dotenv from 'dotenv'
import { generalRateLimiter } from "./middleware/rateLimiter"
import apiRoutes from './routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT

app.use(corsOptions)
app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use(generalRateLimiter)
app.use("/api", apiRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(PORT, () => console.log(`server running at ${PORT}`))