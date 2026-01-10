import express from "express"
import {toNodeHandler} from "better-auth/node"
import { auth } from "./lib/auth"
import cors from 'cors'

const app = express()
const PORT = process.env.PORT

app.use(cors({
    origin : process.env.FRONTEND_URL,
    methods : ['GET','POST','PUT','PATCH','OPTIONS',"DELETE"],
    credentials : true
}))
app.use(express.json())
app.use(express.urlencoded({extended : true}))


app.all("/api/auth/*", toNodeHandler(auth))



app.listen(PORT, () => console.log(`server running at ${PORT}`))