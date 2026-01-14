import { Request, Response } from "express";
import { signUpService, signInService, signOutService, tokenExchange } from "../../services/auth";
import { AppError } from "../../utils/error";
import { status } from 'http-status'

// Sign Up Controller
export async function signUpController(req: Request, res: Response) {
    try {
        const { fullName, email, password } = req.body;
        const data = await signUpService({ fullName, email, password });
        if (!data.user) {
            return res.status(status.BAD_REQUEST).json({ error: "User registration failed" });
        }
        return res.status(status.CREATED).json({ message: "User registered successfully", data });
    } catch (error: any) {
        const errorStatus = error instanceof AppError ? error.statusCode : status.INTERNAL_SERVER_ERROR;
        return res.status(errorStatus).json({ error: error.message || "Internal Server Error" });
    }
}

// Sign In Controller
export async function signInController(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const data = await signInService({ email, password });
        if (!data.user) {
            return res.status(status.BAD_REQUEST).json({ error: "User login failed" });
        }
        return res.status(status.OK).json({ message: "Signed in successfully", data });
    } catch (error: any) {
        const errorStatus = error instanceof AppError ? error.statusCode : status.INTERNAL_SERVER_ERROR;
        return res.status(errorStatus).json({ error: error.message || "Internal Server Error" });
    }
}

// Sign Out Controller
export async function signOutController(req: Request, res: Response) {
    try {
        const data = await signOutService();
        if (!data.message) {
            return res.status(status.BAD_REQUEST).json({ error: "User signout failed" });
        }
        res.status(status.OK).json(data);
    } catch (error: any) {
        const errorStatus = error instanceof AppError ? error.statusCode : status.INTERNAL_SERVER_ERROR;
        res.status(errorStatus).json({ error: error.message || "Internal Server Error" });
    }
}

// for token exchange
export async function tokenExchangeController(req: Request, res: Response) {
    try {
        const { code, next, error } = req.query
        if (typeof code !== 'string') {
            return res.redirect(`${process.env.FRONTEND_URL}/error?reason=missing_code`);
        }
        const redirectPath = typeof next === 'string' ? next : '/dashboard'
        if (error) {
            return res.redirect(`${process.env.FRONTEND_URL}/error?reason=${error}`);
        }
        const data = await tokenExchange(code as string)
        if (!data.session.access_token) {
            return res.status(status.INTERNAL_SERVER_ERROR).json({ error: "failed to exchange token" })
        }
        res.cookie('access_token', data.session.access_token, {
            httpOnly : true,
        })
        return res.status(status.OK).json({success : true, path: redirectPath})
    } catch (error: any) {
        const errorStatus = error instanceof AppError ? error.statusCode : status.INTERNAL_SERVER_ERROR;
        res.status(errorStatus).json({ success: false , error: error.message || "Internal Server Error" });
    }
}


