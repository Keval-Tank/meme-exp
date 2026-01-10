import { auth } from "../lib/auth";
import { toNodeHandler } from "better-auth/node";
import { type Request, type Response } from "express";

const authHandler = toNodeHandler(auth)

export const handleAuth = (req : Request, res : Response) => {
    return authHandler(req, res)
}