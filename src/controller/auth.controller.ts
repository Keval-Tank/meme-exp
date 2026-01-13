import { auth } from "../lib/auth";
import { toNodeHandler } from "better-auth/node";
import { type Request, type Response } from "express";


export const handleAuth = (req : Request, res : Response) => {
    try {
        const response = await auth.handler.
        return res.json({
            success : true,
            response
        })
        
    } catch (error) {
        return {
            success : false,
            error
        }
    }
}