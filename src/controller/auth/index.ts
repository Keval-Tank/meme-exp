import { Request, Response } from "express";
import { signUpService, signInService, signOutService } from "../../services/auth";
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
        res.status(status.CREATED).json({ message: "User registered successfully", data });
    } catch (error: any) {
        const errorStatus = error instanceof AppError ? error.statusCode : status.INTERNAL_SERVER_ERROR;
        res.status(errorStatus).json({ error: error.message || "Internal Server Error" });
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
        res.status(status.OK).json({ message: "Signed in successfully", data });
    } catch (error: any) {
        const errorStatus = error instanceof AppError ? error.statusCode : status.INTERNAL_SERVER_ERROR;
        res.status(errorStatus).json({ error: error.message || "Internal Server Error" });
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

