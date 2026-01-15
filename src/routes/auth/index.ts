import {Router} from 'express'
import { signUpController, signInController, signOutController, tokenExchangeController, signInWithGoogleController, renewalController} from '../../controller/auth'

const router = Router()

router.post("/signup", signUpController)
router.post("/signin", signInController)
router.get("/signout", signOutController)
router.get("/signingoogle", signInWithGoogleController)
router.get("/callback", tokenExchangeController)
router.post("/renew", renewalController)

export default router