import { CalibrateSensorInput, DeviceInput, EditDeviceInput, SensorType } from "../models/device.modal"
import { prisma } from "../../prisma/prismaClient"
import mqttService from "./mqtt.service"
import errorHandler from "../utils/errorHandler"
import { Stat } from "../models/stat.modal"



const getStat = async () => {
    try {
        const numberOfDevices = await prisma.device.count()
        const numberOfTasks = await prisma.device.count()
        const numberOfOngoingTasks = await prisma.device.count({
            where: {
                status: {
                    not: "Completed"
                }
            }
        })
        return ({
            numberOfDevices,
            numberOfTasks,
            numberOfOngoingTasks

            
        })
    }
    catch (e) {
        errorHandler(e)
    }


}


export default {
    getStat
}
