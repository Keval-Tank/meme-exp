import { type Request, type Response } from "express";
import { healthCheck } from "../services/healthcheck";

export async function healthCheckController(req:Request, res:Response) {
    const response = await healthCheck();
    if(response.status === 'OK'){
        return res.status(200).json({
            success : true,
            status : response.status
        })
    }
    return res.status(500).json({
        success : false,
        status : response.status
    })
}