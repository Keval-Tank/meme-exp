import { Router } from "express";
import { handleAuth } from "../controller/auth.controller";

const router = Router()

router.all('/auth/{*any}', handleAuth)

export default router