import { Router } from "express";
import authRouter from './auth'
import { healthCheckController } from "../controller/healthCheck.controller";

const router = Router()

router.use("/auth", authRouter)
router.get('/health', healthCheckController)

export default router