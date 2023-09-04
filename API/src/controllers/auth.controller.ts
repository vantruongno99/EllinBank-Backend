import { Request, Response, Router } from 'express';
import AuthService from '../services/auth.service';
import { LoginInput, PasswordChangeInput } from '../models/auth.modal';
import middleware from "../utils/middleware"

require('express-async-errors');

const authRouter = Router();

authRouter.post('/login', async (req: Request, res: Response) => {
    const input: LoginInput = req.body
    const user = await AuthService.login(input)
    res.status(200).json(user)
})

authRouter.get('/', middleware.userExtractor, async (req: Request, res: Response) => {
    res.status(200).json()
})


authRouter.post('/changepassword', middleware.userExtractor, async (req: Request, res: Response) => {
    const input: PasswordChangeInput = req.body
    await AuthService.resetPassword(input)
    res.status(200).json()
})

authRouter.post('/adminresetpassword', middleware.userExtractor, middleware.adminRequire, async (req: Request, res: Response) => {
    const input: PasswordChangeInput = req.body
    await AuthService.adminResetPassword(input)
    res.status(200).json()
})

export default authRouter
