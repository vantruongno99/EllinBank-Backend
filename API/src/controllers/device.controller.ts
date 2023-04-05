import { Request, Response, Router } from 'express';
import { CalibrateSensorInput, SensorType ,SensorTypes } from '../models/device.modal';
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

deviceRouter.post('/:deviceId/calibrate', async (req: Request, res: Response) => {
    const deviceId: string = req.params.deviceId
    const input = req.body
    const result = await deviceService.calibrateSensor(deviceId, input)
    res.status(200).json(result)
})

deviceRouter.get('/:deviceId/:sensorType', async (req: Request, res: Response) => {
    const deviceId: string = req.params.deviceId
    const sensorType: string = req.params.sensorType

    const isSensortype = (a: unknown): a is SensorType => {
        return typeof a === "string" && SensorTypes.includes(a);
    }

    if (isSensortype(sensorType)) {
        const result = await deviceService.readSensor(deviceId, sensorType)
       return res.status(200).json(result)
    }

    return res.status(400).json({
        error: "Invalid Sensor Type"
    })

})


export default deviceRouter
