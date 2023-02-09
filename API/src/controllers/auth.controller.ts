import { Request, Response, Router } from 'express';
import AuthService from '../services/auth.service';
import {LoginInput} from '../models/auth.modal';

require('express-async-errors');

const authRouter = Router();

authRouter.post('/login', async (req: Request, res: Response) => {
    const input: LoginInput = req.body
    const user = await AuthService.login(input)
    res.status(200).json(user)
})

export default authRouter
