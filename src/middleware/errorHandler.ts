import { Request, Response, NextFunction } from 'express'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err.stack || err)
    
    const statusCode = err.status || err.statusCode || 500
    const message = err.message || 'Internal server error'
    
    res.status(statusCode).json({ 
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    })
}

export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' })
}

// Catch async errors - wrap async route handlers
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}