import {rateLimit} from 'express-rate-limit'
import { getRedisClient } from '../lib/redis'
import {RedisStore} from 'rate-limit-redis'
import { NextFunction } from 'express'

const redis = await getRedisClient()

const generalRateLimiter = rateLimit({
    windowMs : 60*1000,
    limit : 100,
    statusCode : 429,
    handler:(req, res, next, options) => {
        console.log("rate limit reached")
        res.status(429).json({
            error : "Rate limit exceeded",
            message : "Too many requests",
            rateLimited : true,
            retryAfter : new Date(Date.now() + options.windowMs)
        })
    },
    standardHeaders : 'draft-8',
    legacyHeaders : false,
    identifier : 'rate_limit',
    passOnStoreError : false,
    store : new RedisStore({
        sendCommand: async(...args : string[]) => redis.sendCommand(args),
        prefix : 'rate-limit:'
    })
})

export {generalRateLimiter}