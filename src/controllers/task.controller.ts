import { Request, Response, Router } from 'express';
import taskService from '../services/task.service';
import middleware from "../utils/middleware"
import { LogQuery } from '../models/task.model';

require('express-async-errors');

const taskRouter = Router();
taskRouter.use(middleware.userExtractor)


taskRouter.post('/', async (req: Request, res: Response) => {    /* #swagger.security = [{
        "bearerAuth": []
    }] */

    const username = req.user?.username
    const newTask = await taskService.createTask(req.body, username)
    res.status(200).json(newTask)
})

taskRouter.put('/:taskId', async (req: Request, res: Response) => {    /* #swagger.security = [{
        "bearerAuth": []
    }] */

    const updateSensor = await taskService.updateTask(req.params.taskId, req.body)
    res.status(200).json(updateSensor)
})

taskRouter.post('/assignSensor', async (req: Request, res: Response) => {    /* #swagger.security = [{
        "bearerAuth": []
    }] */

    const taskId = req.body.taskId
    const deviceId = req.body.deviceId
    const newTask = await taskService.assignSensor(taskId, deviceId)
    res.status(200).json(newTask)
})

taskRouter.post('/unassignSensor', async (req: Request, res: Response) => {    /* #swagger.security = [{
        "bearerAuth": []
    }] */

    const taskId = req.body.taskId
    const deviceId = req.body.deviceId
    await taskService.unassignSensor(taskId, deviceId)
    res.status(200).end()
})

taskRouter.get('/:taskId', async (req: Request, res: Response) => {    /* #swagger.security = [{
        "bearerAuth": []
    }] */

    const taskId = parseInt(req.params.taskId)
    const sensors = await taskService.findTask(taskId)
    res.status(200).json(sensors)
})

taskRouter.get('/:taskId/logs', async (req: Request, res: Response) => {    /* #swagger.security = [{
        "bearerAuth": []
    }] */

    const taskId = parseInt(req.params.taskId)
    const query: LogQuery = req.query
    const logs = await taskService.getLogs(taskId, query)
    res.status(200).json(logs)
})


taskRouter.get('/', async (req: Request, res: Response) => {    /* #swagger.security = [{
        "bearerAuth": []
    }] */

    let company
    if (req.user?.role === "user") {
        company = req.user.company
    }
    const option = {
        company: company
    }
    const sensors = await taskService.findAllTask(option)
    res.status(200).json(sensors)
})

taskRouter.put('/:taskId/complete', async (req: Request, res: Response) => {    /* #swagger.security = [{
        "bearerAuth": []
    }] */

    const username = req.user?.username
    const taskId = parseInt(req.params.taskId)
    const sensors = await taskService.completeTask(taskId, username)
    res.status(200).json(sensors)
})

taskRouter.put('/:taskId/pause', async (req: Request, res: Response) => {    /* #swagger.security = [{
        "bearerAuth": []
    }] */

    const username = req.user?.username
    const taskId = parseInt(req.params.taskId)
    const sensors = await taskService.pasueTask(taskId, username)
    res.status(200).json(sensors)
})

taskRouter.put('/:taskId/resume', async (req: Request, res: Response) => {    /* #swagger.security = [{
        "bearerAuth": []
    }] */

    const username = req.user?.username
    const taskId = parseInt(req.params.taskId)
    const sensors = await taskService.resumeTask(taskId, username)
    res.status(200).json(sensors)
})

taskRouter.delete('/:taskId', async (req: Request, res: Response) => {    /* #swagger.security = [{
        "bearerAuth": []
    }] */

    const taskId = parseInt(req.params.taskId)
    const deleteDevice = await taskService.deleteTask(taskId)
    res.status(200).json(deleteDevice)
})



export default taskRouter
