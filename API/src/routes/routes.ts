import { Router } from 'express';
import authRouter from '../controllers/auth.controller'; 
import deviceRouter from '../controllers/device.controller';
import userRouter from '../controllers/user.controller';
import taskRouter from '../controllers/task.controller';
import statRouter from '../controllers/stat.controller';


const routes = Router()
routes.use('/api/auth',authRouter)
routes.use('/api/user',userRouter)
routes.use('/api/device',deviceRouter)
routes.use('/api/task',taskRouter)
routes.use('/api/stat',statRouter)



export default routes 