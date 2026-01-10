import express from "express"
import { corsOptions } from "./config/cors"
import apiRoutes from './routes'
import { errorHandler, notFoundHandler } from "./middleware/errorHandler"
import { toNodeHandler } from "better-auth/node"
import { auth } from "./lib/auth"


const app = express()
const PORT = process.env.PORT

app.use(corsOptions)
app.use(express.json())
app.use(express.urlencoded({extended : true}))


// app.use('/api', apiRoutes)
app.all("/api/auth/{*any}", toNodeHandler(auth))

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(PORT, () => console.log(`server running at ${PORT}`))