import { Request, Response } from "express";
import { signUpService, signInService, signOutService, tokenExchange, signInWithGoogle, tokenRenewal } from "../../services/auth";
import { AppError } from "../../utils/error";
import { status } from 'http-status'
import { success } from "better-auth/*";

// Sign Up Controller
export async function signUpController(req: Request, res: Response) {
    try {
        const { fullName, email, password } = req.body;
        const data = await signUpService({ fullName, email, password });
        if (!data.session) {
            return res.status(status.BAD_REQUEST).json({ error: "User registration failed" });
        }
        const accessToken = data.session.access_token
        const refreshToken = data.session.refresh_token
        res.cookie('sb-access-token', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: data.session.expires_in * 1000,
        })
        res.cookie('sb-refresh-token', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24
        })
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
        if (!data.session) {
            return res.status(status.BAD_REQUEST).json({ error: "User login failed" });
        }
        const accessToken = data.session.access_token
        const refreshToken = data.session.refresh_token
        res.cookie('sb-access-token', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: data.session.expires_in * 1000,
        })
        res.cookie('sb-refresh-token', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24
        })
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
            console.log("message not found")
            return res.status(status.BAD_REQUEST).json({ error: "User signout failed" });
        }
        res.clearCookie('sb-access-token')
        res.clearCookie('sb-refresh-token')
        res.status(status.OK).json(data);
    } catch (error: any) {
        console.log("sign out controller error -> ", error)
        const errorStatus = error instanceof AppError ? error.statusCode : status.INTERNAL_SERVER_ERROR;
        res.status(errorStatus).json({ error: error.message || "Internal Server Error" });
    }
}

// sign in with google
export async function signInWithGoogleController(req: Request, res: Response) {
    try {
        const response = await signInWithGoogle()
        if (!response.url) {
            return res.status(status.INTERNAL_SERVER_ERROR).json({ error: "Failed to continue with google" })
        }
        res.redirect(response.url)
    } catch (error: any) {
        console.log("Failed to login with google", error)
        const errorStatus = error instanceof AppError ? error.statusCode : status.INTERNAL_SERVER_ERROR;
        res.status(errorStatus).json({ success: false, error: error.message || "Internal Server Error" });
    }
}

// for token exchange
export async function tokenExchangeController(req: Request, res: Response) {
    try {
        const { code, next, error } = req.query
        if (typeof code !== 'string') {
            return res.redirect(`${process.env.FRONTEND_URL}/error?reason=missing_code`);
        } else {
            console.log("found code -> ", code)
        }
        const redirectPath = typeof next === 'string' ? next : 'http://localhost:3000/dashboard'
        if (error) {
            return res.redirect(`${process.env.FRONTEND_URL}/error?reason=${error}`);
        }
        const data = await tokenExchange(code as string)
        if (!data.session) {
            return res.status(status.INTERNAL_SERVER_ERROR).json({ error: "failed to exchange token" })
        }
        const accessToken = data.session.access_token
        const refreshToken = data.session.refresh_token
        res.cookie('sb-access-token', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: data.session.expires_in * 1000,
        })
        res.cookie('sb-refresh-token', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24
        })
        return res.redirect(redirectPath)
    } catch (error: any) {
        console.log("token exchange error", error)
        const errorStatus = error instanceof AppError ? error.statusCode : status.INTERNAL_SERVER_ERROR;
        res.status(errorStatus).json({ success: false, error: error.message || "Internal Server Error" });
    }
}

// for token renewal
export async function renewalController(req: Request, res: Response) {
    try {
        const refreshToken = req.cookies['sb-refresh-token']
        if (!refreshToken) {
            return res.status(status.UNAUTHORIZED).json({ error: "Unauthorized, refresh token not found" })
        }
        const data = await tokenRenewal(refreshToken)
        if (!data.session) {
            return res.status(status.INTERNAL_SERVER_ERROR).json({ error: "Failed to renew tokens" })
        }
        const newAccessToken = data.session.access_token
        const newRefreshToken = data.session.refresh_token
        return res.json({
            success : true,
            newAccessToken,
            newRefreshToken,
            expiresIn : data.session.expires_in,
            message : 'Token renewed successfully'
        })
    }
    catch (error : any) {
        console.log("token renewal error -> ", error)
        const errorStatus = error instanceof AppError ? error.statusCode : status.INTERNAL_SERVER_ERROR;
        res.status(errorStatus).json({ success: false, error: error.message || "Internal Server Error" });
    }
}


