import { CalibrateSensorInput, DeviceInput, EditDeviceInput, SensorType } from "../models/device.modal"
import { prisma } from "../../prisma/prismaClient"
import mqttService from "./mqtt.service"
import errorHandler from "../utils/errorHandler"


const createDevice = async (device: DeviceInput) => {
  const name = device.name.trim()
  const id = device.id.trim()

  if (!name) {
    throw ({ name: 'ValidationError', message: { name: ["can't be blank"] } });
  }

  if (!id) {
    throw ({ name: 'ValidationError', message: { id: ["can't be blank"] } });
  }

  try {
    const newSensor = await prisma.device.create({
      data: {
        id,
        name,
        updateUTC: new Date()
      }
    })
    return newSensor

  }
  catch (e: any) {
    if (e.meta.target) {
      throw ({ name: 'ValidationError', message: `${e.meta.target} is not unique` });
    }
  }
}

const editDevice = async (deviceId: string, device: EditDeviceInput) => {
  const name = device.name
  const id = device.id
  if (!name) {
    throw ({ name: 'ValidationError', message: { name: ["can't be blank"] } });
  }

  if (!id) {
    throw ({ name: 'ValidationError', message: { id: ["can't be blank"] } });
  }

  try {
    const updateSensor = await prisma.device.update({
      where: {
        id: deviceId
      },
      data: {
        ...device,
        updateUTC: new Date()
      },
    })

    return updateSensor
  }
  catch (e: any) {
    errorHandler(e)
  }
}

const findAllDevice = async () => {
  const sensors = await prisma.device.findMany({})
  return sensors;
}

const deleteDevice = async (deviceId: string) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        Device: {
          some: {
            Device: {
              id: deviceId
            }
          }
        },
        status: {
          not: "COMPLETED"
        }
      },
    })

    for (const task of tasks) {
      await mqttService.pauseDevice(deviceId, task.id)
    }


    await prisma.device.delete({
      where: {
        id: deviceId,
      },
    })

    await prisma.log.deleteMany({
      where: {
        deviceId: deviceId
      }
    })

  }


  catch (e: any) {
    errorHandler(e)
  }
}


const findDevice = async (deviceId: string) => {
  try {
    const sensor = await prisma.device.findUniqueOrThrow({
      where: {
        id: deviceId,
      },
      include: {
        Task: {
          select: {
            Task: true
          }
        }
      },

    })



    return sensor
  }
  catch (e: any) {
    errorHandler(e)
  }
}

const findAvaibleDevice = async () => {
  const sensors = await prisma.device.findMany({
    where: {
      Task: {
        none: {
          Task: {
            status: {
              not: "COMPLETED"
            },
          }
        }
      }
    }
  })


  return sensors;
}

const calibrateSensor = async (deviceId: string, input: CalibrateSensorInput) => {
  try {
    const device = await prisma.device.findUniqueOrThrow({
      where: {
        id: deviceId,
      },
    })

    if (device.status === "RUNNING") {
      throw ({ name: 'ValidationError', message: "Device still has running tasks" });
    }
    return await mqttService.calibrate(deviceId, input)
  }
  catch (e: any) {
    throw ({ name: 'SensorError', message: "No or Invalid Response from sensor" });
  }
}

const readSensor = async (deviceId: string, sensorType: SensorType) => {
  try {
    const device = await prisma.device.findUniqueOrThrow({
      where: {
        id: deviceId,
      }
    })

    if (device.status === "RUNNING") {
      throw ({ name: 'ValidationError', message: "Device still has running tasks" });
    }
    return await mqttService.read(deviceId, sensorType)
  }
  catch (e: any) {
    throw ({ name: 'SensorError', message: "No or Invalid Response from sensor" });
  }
}

const pauseDevice = async (id: string) => {
  if (!id) {
    throw ({ name: 'ValidationError', message: { id: ["can't be blank"] } });
  }

  const device = await prisma.device.findUniqueOrThrow({
    where: {
      id: id
    }
  })

  const currentTask = await prisma.task.findFirst({
    where: {
      Device: {
        some: {
          Device: {
            id: id
          }
        }
      }
    }

  })



  if (!device.status) {
    throw ({ name: 'ValidationError', message: "Device deoes not have running task" });
  }

  if (device.status === "PAUSED") {
    throw ({ name: 'ValidationError', message: "Device has already been paused" });
  }

  try {
    const data = await prisma.device.update({
      where: {
        id: id
      },
      data: {
        status: "PAUSED",

      }
    })

    currentTask && await mqttService.pauseDevice(id, currentTask.id)

    return data


  }
  catch (e: any) {
    errorHandler(e)
  }
}

const resumeDevice = async (id: string) => {
  if (!id) {
    throw ({ name: 'ValidationError', message: { id: ["can't be blank"] } });
  }

  const device = await prisma.device.findUniqueOrThrow({
    where: {
      id: id
    }
  })

  const currentTask = await prisma.task.findFirst({
    where: {
      Device: {
        some: {
          Device: {
            id: id
          }
        }
      }
    }

  })


  if (!device.status) {
    throw ({ name: 'ValidationError', message: "Device does not have running task" });
  }


  if (device.status !== "PAUSED") {
    throw ({ name: 'ValidationError', message: "Device needs to be Paused" });
  }


  try {
    const data = await prisma.device.update({
      where: {
        id: id
      },
      data: {
        status: "RUNNING"
      }
    })

    currentTask && await mqttService.resumeDevice(id, currentTask.id)

    return data

  }
  catch (e: any) {
    errorHandler(e)
  }
}


export default {
  createDevice,
  findAllDevice,
  deleteDevice,
  findDevice,
  editDevice,
  findAvaibleDevice,
  calibrateSensor,
  readSensor,
  pauseDevice,
  resumeDevice
}
