import { Request, Response, Router } from 'express';
import taskService from '../services/task.service';
import middleware from "../utils/middleware"

require('express-async-errors');

const taskRouter = Router();
taskRouter.use(middleware.userExtractor)


taskRouter.post('/', async (req: Request, res: Response) => {
    const username = req.user?.username
    const newTask = await taskService.createTask(req.body,username)
    res.status(200).json(newTask)
})

taskRouter.post('/assign', async (req: Request, res: Response) => {
    const taskId = req.body.taskId
    const sensorId = req.body.sensorId
    const newTask = await taskService.assignSensor(taskId,sensorId)
    res.status(200).json(newTask)
})

taskRouter.get('/:taskId', async (req: Request, res: Response) => {
    const taskId = req.params.taskId
    const sensors = await taskService.findTask(taskId)
    res.status(200).json(sensors)
})

taskRouter.get('/', async (req: Request, res: Response) => {
    const sensors = await taskService.findAllTask()
    res.status(200).json(sensors)
})


taskRouter.delete('/:taskId', async (req: Request, res: Response) =>{
    const taskId = req.params.taskId
    const deleteSensor = await taskService.deleteTask(taskId)
    res.status(200).json(deleteSensor)
})



export default taskRouter
