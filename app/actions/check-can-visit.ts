"use server"

import jwt, { JwtPayload } from "jsonwebtoken"
import { getRedisClient } from "@/lib/redis"

interface TokenPayload extends JwtPayload {
    id: number
    sessionId: string
}

interface CachedUserData {
    subscription: "FREE" | "PRO" | "BYOK"
    role: string
    sessionId: string
    refreshToken: string
}

interface CheckCanVisitResponse {
    success: boolean
    authorized: boolean
    error?: string
    userData?: {
        role: string
        subscription: string
    }
}

// Define protected routes and their required roles
const PROTECTED_ROUTES: Record<string, string[]> = {
    "/admin": ["admin"],
    "/api/admin": ["admin"],
}

/**
 * Checks if a user is authorized to access a specific route
 * @param signedToken - JWT token with payload {id, sessionId}
 * @param route - The route the user is trying to access (e.g., "/admin")
 * @returns CheckCanVisitResponse indicating authorization status
 */
export async function checkCanVisit(
    signedToken: string,
    route: string
): Promise<CheckCanVisitResponse> {
    let redis;
    try {
        // Verify the JWT token
        const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET!
        const payload = jwt.verify(signedToken, accessTokenSecret) as TokenPayload

        if (!payload.id || !payload.sessionId) {
            return {
                success: false,
                authorized: false,
                error: "Invalid token payload"
            }
        }

        // Fetch user data from Redis cache
        redis = await getRedisClient()
        const cachedData = await redis.get(payload.id.toString())

        if (!cachedData) {
            return {
                success: false,
                authorized: false,
                error: "User session not found in cache"
            }
        }

        const userData: CachedUserData = JSON.parse(cachedData)

        // Verify session ID matches
        if (userData.sessionId !== payload.sessionId) {
            return {
                success: false,
                authorized: false,
                error: "Session ID mismatch - possible session hijacking"
            }
        }

        // Check if the route requires specific roles
        const requiredRoles = getRequiredRolesForRoute(route)

        if (requiredRoles.length > 0) {
            const hasRequiredRole = requiredRoles.includes(userData.role.toLowerCase())

            if (!hasRequiredRole) {
                return {
                    success: true,
                    authorized: false,
                    error: `Access denied. Required role(s): ${requiredRoles.join(", ")}`,
                    userData: {
                        role: userData.role,
                        subscription: userData.subscription
                    }
                }
            }
        }

        return {
            success: true,
            authorized: true,
            userData: {
                role: userData.role,
                subscription: userData.subscription
            }
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return {
                success: false,
                authorized: false,
                error: "Token expired"
            }
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return {
                success: false,
                authorized: false,
                error: "Invalid token"
            }
        }

        return {
            success: false,
            authorized: false,
            error: "Failed to verify authorization"
        }
    } finally {
        if (redis) {
            redis.destroy()
        }
    }
}

/**
 * Get the required roles for a specific route
 * @param route - The route to check
 * @returns Array of required roles (empty if no specific role is required)
 */
function getRequiredRolesForRoute(route: string): string[] {
    // Check for exact match first
    if (PROTECTED_ROUTES[route]) {
        return PROTECTED_ROUTES[route]
    }

    // Check for prefix match (e.g., "/admin/users" matches "/admin")
    for (const [protectedRoute, roles] of Object.entries(PROTECTED_ROUTES)) {
        if (route.startsWith(protectedRoute)) {
            return roles
        }
    }

    return []
}

/**
 * Check if user has admin access
 * @param signedToken - JWT token with payload {id, sessionId}
 * @returns CheckCanVisitResponse for admin route
 */
export async function checkIsAdmin(signedToken: string): Promise<CheckCanVisitResponse> {
    return checkCanVisit(signedToken, "/admin")
}

/**
 * Check if user has a specific subscription level
 * @param signedToken - JWT token with payload {id, sessionId}
 * @param requiredSubscription - The required subscription level
 * @returns CheckCanVisitResponse with subscription check
 */
export async function checkSubscription(
    signedToken: string,
    requiredSubscription: "FREE" | "PRO" | "BYOK"
): Promise<CheckCanVisitResponse> {
    let redis;
    try {
        const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET!
        const payload = jwt.verify(signedToken, accessTokenSecret) as TokenPayload

        if (!payload.id || !payload.sessionId) {
            return {
                success: false,
                authorized: false,
                error: "Invalid token payload"
            }
        }

        redis = await getRedisClient()
        const cachedData = await redis.get(payload.id.toString())

        if (!cachedData) {
            return {
                success: false,
                authorized: false,
                error: "User session not found in cache"
            }
        }

        const userData: CachedUserData = JSON.parse(cachedData)

        // Verify session ID matches
        if (userData.sessionId !== payload.sessionId) {
            return {
                success: false,
                authorized: false,
                error: "Session ID mismatch"
            }
        }

        // Define subscription hierarchy
        const subscriptionLevels: Record<string, number> = {
            "FREE": 1,
            "PRO": 2,
            "BYOK": 3
        }

        const userLevel = subscriptionLevels[userData.subscription] || 0
        const requiredLevel = subscriptionLevels[requiredSubscription] || 0

        if (userLevel < requiredLevel) {
            return {
                success: true,
                authorized: false,
                error: `Subscription upgrade required. Current: ${userData.subscription}, Required: ${requiredSubscription}`,
                userData: {
                    role: userData.role,
                    subscription: userData.subscription
                }
            }
        }

        return {
            success: true,
            authorized: true,
            userData: {
                role: userData.role,
                subscription: userData.subscription
            }
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return {
                success: false,
                authorized: false,
                error: "Token expired"
            }
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return {
                success: false,
                authorized: false,
                error: "Invalid token"
            }
        }

        return {
            success: false,
            authorized: false,
            error: "Failed to verify subscription"
        }
    } finally {
        if (redis) {
            redis.destroy()
        }
    }
}
