import { Request, Response, Router } from 'express';
import sensorService from '../services/device.service';
import middleware from "../utils/middleware"

require('express-async-errors');

const deviceRouter = Router();
deviceRouter.use(middleware.userExtractor)


deviceRouter.post('/', async (req: Request, res: Response) => {
    const sensors = await sensorService.createDevice(req.body)
    res.status(200).json(sensors)
})

deviceRouter.put('/:deviceId',async (req: Request, res: Response) => {
    const updateSensor = await sensorService.editDevice(req.params.deviceId,req.body)
    res.status(200).json(updateSensor)
})

deviceRouter.get('/', async (req: Request, res: Response) => {
    const sensors = await sensorService.findAllDevice()
    res.status(200).json(sensors)
})

deviceRouter.get('/:deviceId', async (req: Request, res: Response) => {
    const deviceId = req.params.deviceId
    const sensors = await sensorService.findDevice(deviceId)
    res.status(200).json(sensors)
})


deviceRouter.delete('/:deviceId',async (req: Request, res: Response)=>{
    const deviceId = req.params.deviceId
   const deleteDevice =  await sensorService.deleteDevice(deviceId)
    res.status(200).json(deleteDevice)
})


export default deviceRouter
