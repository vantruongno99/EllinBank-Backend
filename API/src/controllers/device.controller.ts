import { Request, Response, Router } from 'express';
import deviceService from '../services/device.service';
import middleware from "../utils/middleware"

require('express-async-errors');

const deviceRouter = Router();
deviceRouter.use(middleware.userExtractor)


deviceRouter.post('/', async (req: Request, res: Response) => {
    const sensors = await deviceService.createDevice(req.body)
    res.status(200).json(sensors)
})

deviceRouter.put('/:deviceId', async (req: Request, res: Response) => {
    const updateSensor = await deviceService.editDevice(req.params.deviceId, req.body)
    res.status(200).json(updateSensor)
})

deviceRouter.get('/', async (req: Request, res: Response) => {
    const sensors = await deviceService.findAllDevice()
    res.status(200).json(sensors)
})

deviceRouter.get('/getAvaibleDevice', async (req: Request, res: Response) => {
    const sensors = await deviceService.findAvaibleDevice()
    res.status(200).json(sensors)
})



deviceRouter.get('/:deviceId', async (req: Request, res: Response) => {
    const deviceId = req.params.deviceId
    const sensors = await deviceService.findDevice(deviceId)
    res.status(200).json(sensors)
})

deviceRouter.delete('/:deviceId', async (req: Request, res: Response) => {
    const deviceId = req.params.deviceId
    const deleteDevice = await deviceService.deleteDevice(deviceId)
    res.status(200).json(deleteDevice)
})


export default deviceRouter
