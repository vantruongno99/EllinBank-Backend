import { Request, Response, Router } from 'express';
import userService from '../services/user.service';
import middleware from "../utils/middleware"
import { RegisterInput } from '../models/auth.modal';

require('express-async-errors');

const userRouter = Router();

userRouter.get('/', middleware.userExtractor, middleware.adminRequire, async (req: Request, res: Response) => {
    const users = await userService.findAllUser()
    res.status(200).json(users)
})

userRouter.get('/current', middleware.userExtractor, async (req: Request, res: Response) => {
    res.status(200).json(req.user)
})

userRouter.get('/:username', middleware.userExtractor, middleware.adminRequire, async (req: Request, res: Response) => {
    const requestedUser: string = req.params.username
    if (!requestedUser) {
        res.status(500).send('username is blank')
        return;
    }
    const user = await userService.findUserByUsername(requestedUser)
    if (!user) {
        res.status(401).send('user does not exist')
    }
    res.status(200).json(user);
})


userRouter.post('/signup', middleware.userExtractor, middleware.adminRequire, async (req: Request, res: Response) => {
    const body: RegisterInput = req.body
    const user = await userService.createUser(body)
    res.status(200).send(user)

})


export default userRouter
