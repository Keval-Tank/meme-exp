import { Router } from "express";
import { handleAuth } from "../controller/auth.controller";
import { healthCheckController } from "../controller/healthCheck.controller";

const router = Router()

// router.all('/auth/{*any}', handleAuth)
router.get('/health', healthCheckController)

export default router