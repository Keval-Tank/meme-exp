import {Router} from 'express'
import { signUpController, signInController, signOutController, tokenExchangeController, signInWithGoogleController} from '../../controller/auth'

const router = Router()

router.post("/signup", signUpController)
router.post("/signin", signInController)
router.get("/signout", signOutController)
router.get("/signingoogle", signInWithGoogleController)
router.get("/callback", tokenExchangeController)

export default router