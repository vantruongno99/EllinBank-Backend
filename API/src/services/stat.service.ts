import { CalibrateSensorInput, DeviceInput, EditDeviceInput, SensorType } from "../models/device.modal"
import { prisma } from "../../prisma/prismaClient"
import mqttService from "./mqtt.service"
import errorHandler from "../utils/errorHandler"
import { Stat } from "../models/stat.modal"



const getStat = async (company?: string) => {
    try {
        const numberOfDevices = await prisma.device.count({})
        const numberOfTasks = await prisma.task.count({
            where : {
                ...(company ? {company : company} : {})
          }
        })
        const numberOfOngoingTasks = await prisma.task.count({
            where: {
                status: {
                    not: "Completed"
                },
                    ...(company ? {company : company} : {})
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
