import { timeStamp } from "node:console";
import { prisma } from "../lib/prisma";
import { getRedisClient } from "../lib/redis";
import { HealthCheckResponse } from "../types";

export async function healthCheck() : Promise<HealthCheckResponse> {
    try {
        // Check database
        await prisma.$queryRaw`SELECT 1`;

        // Check Redis
        const redis = await getRedisClient();
        await redis.ping();

        return {
            status : 'OK',
            timeStamp : new Date().toISOString(),
            services : {
                database : "connected",
                redis : 'connected'
            }
        }
    } catch (error) {
        return {
            status : "ERROR",
            timeStamp : new Date().toISOString(),
            error,
        }
    }
}