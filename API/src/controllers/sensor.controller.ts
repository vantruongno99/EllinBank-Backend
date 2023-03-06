import { Request, Response, Router } from 'express';
import sensorService from '../services/sensor.service';
import middleware from "../utils/middleware"

require('express-async-errors');

const sensorRouter = Router();
sensorRouter.use(middleware.userExtractor)


sensorRouter.post('/', async (req: Request, res: Response) => {
    const sensors = await sensorService.createSensor(req.body)
    res.status(200).json(sensors)
})

sensorRouter.put('/:sensorId',async (req: Request, res: Response) => {
    const updateSensor = await sensorService.editSensor(req.params.sensorId,req.body)
    res.status(200).json(updateSensor)
})

sensorRouter.get('/', async (req: Request, res: Response) => {
    const sensors = await sensorService.findAllSensor()
    res.status(200).json(sensors)
})

sensorRouter.get('/:sensorId', async (req: Request, res: Response) => {
    const sensorId = req.params.sensorId
    const sensors = await sensorService.findSensor(sensorId)
    res.status(200).json(sensors)
})


sensorRouter.delete('/:sensorId',async (req: Request, res: Response)=>{
    const sensorId = req.params.sensorId
   const deleteSensor =  await sensorService.deleteSensor(sensorId)
    res.status(200).json(deleteSensor)
})


export default sensorRouter
