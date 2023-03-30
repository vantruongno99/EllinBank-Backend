import { Request, Response, Router } from 'express';
import taskService from '../services/task.service';
import middleware from "../utils/middleware"

require('express-async-errors');

const taskRouter = Router();
taskRouter.use(middleware.userExtractor)


taskRouter.post('/', async (req: Request, res: Response) => {
    const username = req.user?.username
    const newTask = await taskService.createTask(req.body, username)
    res.status(200).json(newTask)
})

taskRouter.post('/assignSensor', async (req: Request, res: Response) => {
    const taskId = req.body.taskId
    const deviceId = req.body.deviceId
    const newTask = await taskService.assignSensor(taskId, deviceId)
    res.status(200).json(newTask)
})

taskRouter.get('/:taskId', async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.taskId)
    const sensors = await taskService.findTask(taskId)
    res.status(200).json(sensors)
})

taskRouter.get('/', async (req: Request, res: Response) => {
    const sensors = await taskService.findAllTask()
    res.status(200).json(sensors)
})

taskRouter.put('/complete/:taskId', async (req: Request, res: Response) => {
    const username = req.user?.username
    const taskId = parseInt(req.params.taskId)
    const sensors = await taskService.completeTask(taskId,username)
    res.status(200).json(sensors)
})



taskRouter.delete('/:taskId', async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.taskId)
    const deleteDevice = await taskService.deleteTask(taskId)
    res.status(200).json(deleteDevice)
})



export default taskRouter
