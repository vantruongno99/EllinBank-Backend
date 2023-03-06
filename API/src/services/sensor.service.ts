import { SensorInput, EditSensorInput } from "../models/sensor.modal"
import { prisma } from "../../prisma/prismaClient"

const createSensor = async (sensor: SensorInput) => {
  const name = sensor.name.trim()
  const code = sensor.code.trim()

  if (!name) {
    throw ({ name: 'ValidationError', message: { name: ["can't be blank"] } });
  }

  if (!code) {
    throw ({ name: 'ValidationError', message: { code: ["can't be blank"] } });
  }

  try {
    const newSensor = await prisma.sensor.create({
      data: {
        name,
        code
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

const editSensor = async (sensorId: string, editSensor: EditSensorInput) => {
  const name = editSensor.name
  const code = editSensor.code
  if (!name) {
    throw ({ name: 'ValidationError', message: { name: ["can't be blank"] } });
  }

  if (!code) {
    throw ({ name: 'ValidationError', message: { code: ["can't be blank"] } });
  }

  try {
    const updateSensor = await prisma.sensor.update({
      where: {
        id: sensorId
      },
      data: {
        ...editSensor
      },
    })

    return updateSensor
  }
  catch (e: any) {
    throw ({ name: 'ValidationError', message: JSON.stringify(e) });
  }
}

const findAllSensor = async () => {
  const sensors = await prisma.sensor.findMany({
    include: {
      Task: {
        select: {
          Task: true
        }
      }
    },
  })

  return sensors;
}

const deleteSensor = async (sensorId: string) => {
  try {
    const deleteSensor = await prisma.sensor.delete({
      where: {
        id: sensorId,
      },
    })

    return deleteSensor
  }
  catch (e: any) {
    throw ({ name: 'ValidationError', message: JSON.stringify(e) });
  }
}


const findSensor = async (sensorId: string) => {
  try {
    const sensor = await prisma.sensor.findUniqueOrThrow({
      where: {
        id: sensorId,
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

export default {
  createSensor,
  findAllSensor,
  deleteSensor,
  findSensor,
  editSensor
}
