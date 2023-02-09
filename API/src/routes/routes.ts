import { Router } from 'express';
import authRouter from '../controllers/auth.controller'; 
import userRouter from '../controllers/user.controller';

const routes = Router()
routes.use('/api/auth',authRouter)
routes.use('/api/user',userRouter)

export default routes 