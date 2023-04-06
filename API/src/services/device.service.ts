import { CalibrateSensorInput, DeviceInput, EditDeviceInput, SensorType } from "../models/device.modal"
import { prisma } from "../../prisma/prismaClient"
import mqttClient from "../mqtt/mqttClient"
import { Session } from "inspector"



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
        name
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
        ...device
      },
    })

    return updateSensor
  }
  catch (e: any) {
    throw ({ name: 'ValidationError', message: JSON.stringify(e) });
  }
}

const findAllDevice = async () => {
  const sensors = await prisma.device.findMany({})
  return sensors;
}

const deleteDevice = async (deviceId: string) => {
  try {
    const deleteDevice = await prisma.device.delete({
      where: {
        id: deviceId,
      },
    })

    return deleteDevice
  }
  catch (e: any) {
    throw ({ name: 'ValidationError', message: JSON.stringify(e) });
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
    throw ({ name: 'ValidationError', message: JSON.stringify(e) });

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
  const device = await prisma.device.findUniqueOrThrow({
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

  if (!device.Task.every(a => a.Task.status !== "STARTED")) {
    throw ({ name: 'ValidationError', message: "Device still has running tasks" });
  }
  await mqttClient.sendMessage(`CAL,${input.gasType}, ${input.calType}, ${input.calValue}`, `ToSensor/${deviceId}`)
}

const readSensor = async (deviceId: string ,input: SensorType) => {
  const device = await prisma.device.findUniqueOrThrow({
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

  if (!device.Task.every(a => a.Task.status !== "STARTED")) {
    throw ({ name: 'ValidationError', message: "Device still has running tasks" });
  }
  await mqttClient.sendMessage(`READ,${input}`, `ToSensor/${deviceId}`)
}

export default {
  createDevice,
  findAllDevice,
  deleteDevice,
  findDevice,
  editDevice,
  findAvaibleDevice,
  calibrateSensor,
  readSensor
}
