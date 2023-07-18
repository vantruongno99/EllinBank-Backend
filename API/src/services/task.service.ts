import { TaskEditInput, TaskInput } from "../models/task.model"
import { prisma } from "../../prisma/prismaClient"
import { ConfigSend } from "../models/mqtt.modals";
import mqttService from "./mqtt.service";
import errorHandler from "../utils/errorHandler"
import redisClient from "../redis/redisClient";


const createTask = async (task: TaskInput, user: string | undefined) => {
  const name = task.name.trim()
  const startTime = task.startTime
  const endTime = task.endTime


  if (!name) {
    throw ({ name: 'ValidationError', message: { name: ["can't be blank"] } });
  }
  if (!user) {
    throw ({ name: 'ValidationError', message: { user: ["invalid user"] } });
  }
  if (!startTime) {
    throw ({ name: 'ValidationError', message: { startTime: ["can't be blank"] } });
  }
  if (!endTime) {
    throw ({ name: 'ValidationError', message: { endTime: ["can't be blank"] } });
  }
  if (new Date(endTime) < new Date(startTime)) {
    throw ({ name: 'ValidationError', message: "" });
  }



  try {
    const newTask = await prisma.task.create({
      data: {
        ...task,
        createUser: user,
        createdUTC: (new Date()).toISOString()
      }
    })
    return newTask

  }
  catch (e: any) {
    errorHandler(e)
  }
}

const assignSensor = async (taskId: number, deviceId: string) => {
  if (!taskId) {
    throw ({ name: 'ValidationError', message: { taskId: ["can't be blank"] } });
  }

  if (!deviceId) {
    throw ({ name: 'ValidationError', message: { deviceId: ["can't be blank"] } });
  }

  try {
    const deviceTask = await prisma.device_Task.create({
      data: {
        taskId,
        deviceId
      }
    })

    const task = await prisma.task.findUniqueOrThrow({
      where: {
        id: taskId,
      }
    })

    const config: ConfigSend = {
      taskId: taskId,
      msgTimeUTC: Math.floor(Date.now() / 1000),
      startTimeUTC: Math.floor(new Date(task.startTime).getTime() / 1000),
      endTimeUTC: Math.floor(new Date(task.endTime).getTime() / 1000),
      logPeriod: task.logPeriod,
    }

    mqttService.sendConfigure(deviceId, config);

    await prisma.device.update({
      where: {
        id: deviceId,
      },
      data: {
        status: "RUNNING",
        assigned: true
      },
    })

    return deviceTask


  }
  catch (e: any) {
    errorHandler(e)

  }
}

const unassignSensor = async (taskId: number, deviceId: string) => {
  if (!taskId) {
    throw ({ name: 'ValidationError', message: { taskId: ["can't be blank"] } });
  }

  if (!deviceId) {
    throw ({ name: 'ValidationError', message: { deviceId: ["can't be blank"] } });
  }

  try {
    await prisma.device_Task.delete({
      where: {
        taskId_deviceId: {
          taskId,
          deviceId
        }
      }
    })
    mqttService.stopTask(deviceId, taskId);

    await prisma.device.update({
      where: {
        id: deviceId,
      },
      data: {
        status: "READY",
        assigned: false
      },
    })

  }
  catch (e: any) {
    errorHandler(e)

  }
}

const updateTask = async (taskId: string, input: TaskEditInput) => {

  const id = parseInt(taskId)

  if (!id) {
    throw ({ name: 'ValidationError', message: { taskId: ["Invalid"] } });

  }

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: id
      },
      data: {
        ...input
      },
      include: {
        Device: {
          select: {
            Device: true
          }
        }
      },
    })
    const { Device, ...newTaskDetail } = updatedTask

    const deviceList = updatedTask.Device.map(a => a.Device.id)

    const config: ConfigSend = {
      taskId: updatedTask.id,
      msgTimeUTC: Math.floor(Date.now() / 1000),
      startTimeUTC: Math.floor(new Date(updatedTask.startTime).getTime() / 1000),
      endTimeUTC: Math.floor(new Date(updatedTask.endTime).getTime() / 1000),
      logPeriod: updatedTask.logPeriod,
    }

    for (const deviceId of deviceList) {
      await mqttService.sendConfigure(deviceId, config)
    }

    return newTaskDetail
  }
  catch (e: any) {
    errorHandler(e)
  }
}

const findAllTask = async (company? : string ) => {
  const tasks = await prisma.task.findMany({
    where : {
          ...(company ? {company : company} : {})
    }
  })
  return tasks;
}

const deleteTask = async (taskId: number) => {
  try {

    const task = await prisma.task.findFirstOrThrow({
      where: {
        id: taskId,
      },
      include: {
        Device: {
          select: {
            Device: true
          }
        }
      },

    })

    if (task.status !== "COMPLETED") {

      const deviceList = task.Device.map(a => a.Device.id)


      for (const deviceId of deviceList) {
        await mqttService.stopTask(deviceId, taskId)
      }


      await prisma.device.updateMany({
        where: {
          id: {
            in: deviceList
          },
        },
        data: {
          status: "READY",
          assigned: false
        },
      })

    }



    const deleteTask = await prisma.task.delete({
      where: {
        id: taskId,
      },
    })

    return deleteTask
  }
  catch (e: any) {
    errorHandler(e)
  }

}

const findTask = async (taskId: number) => {
  try {
    const task = await prisma.task.findUniqueOrThrow({
      where: {
        id: taskId,
      },
      include: {
        Device: {
          select: {
            Device: true
          }
        }
      },
    })
    return task
  }
  catch (e: any) {
    errorHandler(e)

  }
}

const completeTask = async (taskId: number, username: string | undefined) => {
  try {

    await prisma.task.findFirstOrThrow({
      where: {
        id: taskId,
        status: {
          not: "COMPLETED"
        }
      }
    })

    await prisma.task.update({
      where: {
        id: taskId
      },
      data: {
        status: "COMPLETED",
        completeUser: username,
        completedUTC: new Date()
      }
    })

    const task = await prisma.task.findFirstOrThrow({
      where: {
        id: taskId,
      },
      include: {
        Device: {
          select: {
            Device: true,

          }
        }
      },

    })

    if (task.status != "COMPLETED") {
      throw ({ name: 'ValidationError', message: { taskId: ["Complete failed"] } });
    }


    const deviceList = task.Device.map(a => a.Device.id)

    for (const deviceId of deviceList) {
      await mqttService.stopTask(deviceId, taskId)
    }




    await prisma.device.updateMany({
      where: {
        id: {
          in: deviceList
        },
      },
      data: {
        status: "READY",
        assigned: false
      },
    })


    return task
  }
  catch (e: any) {
    errorHandler(e)
  }
}

const pasueTask = async (taskId: number, username: string | undefined) => {
  try {

    await prisma.task.findFirstOrThrow({
      where: {
        id: taskId,
        status: {
          equals: "ONGOING"
        }
      }
    })

    await prisma.task.update({
      where: {
        id: taskId
      },
      data: {
        status: "PAUSED"
      }
    })

    const task = await prisma.task.findFirstOrThrow({
      where: {
        id: taskId,
      },
      include: {
        Device: {
          select: {
            Device: true
          }
        }
      },

    })

    if (task.status != "PAUSED") {
      throw ({ name: 'ValidationError', message: { taskId: ["PAUSED failed"] } });
    }


    const deviceList = task.Device.map(a => a.Device.id)

    for (const deviceId of deviceList) {
      await mqttService.pauseTask(deviceId, taskId)
    }






    await prisma.device.updateMany({
      where: {
        id: {
          in: deviceList
        },
      },
      data: {
        status: "PAUSED",
      },
    })


    return task
  }
  catch (e: any) {
    errorHandler(e)
  }
}

const resumeTask = async (taskId: number, username: string | undefined) => {
  try {

    await prisma.task.findFirstOrThrow({
      where: {
        id: taskId,
        status: {
          equals: "PAUSED"
        }
      }
    })

    await prisma.task.update({
      where: {
        id: taskId
      },
      data: {
        status: "ONGOING"
      }
    })

    const task = await prisma.task.findFirstOrThrow({
      where: {
        id: taskId,
      },
      include: {
        Device: {
          select: {
            Device: true
          }
        }
      },

    })

    if (task.status != "ONGOING") {
      throw ({ name: 'ValidationError', message: { taskId: ["RESUME failed"] } });
    }


    const deviceList = task.Device.map(a => a.Device.id)

    for (const deviceId of deviceList) {
      await mqttService.resumeTask(deviceId, taskId)
    }



    await prisma.device.updateMany({
      where: {
        id: {
          in: deviceList
        },
      },
      data: {
        status: "RUNNING",
      },
    })
    return task
  }
  catch (e: any) {
    errorHandler(e)
  }
}

const getLogs = async (taskId: number, type: string | undefined) => {
  try {
    const cacheResults = await redisClient.get(`${taskId}-${type}`);
    if (cacheResults) {
      return JSON.parse(cacheResults);
    }

    else {
      const task = await prisma.task.findFirstOrThrow({
        where: {
          id: taskId
        }
      })

      const logs = await prisma.log.findMany({
        where: {
          taskId: taskId,
          ...(type && { logType: type })
        },
        orderBy: [
          {
            timestampUTC: 'asc',
          },

        ],
      })
      if (task.status === "COMPLETED") {
        await redisClient.set(`${taskId}-${type}`, JSON.stringify(logs));
      }
      return logs
    }
  }

  catch (e: any) {
    errorHandler(e)
  }
}




export default {
  createTask,
  assignSensor,
  findAllTask,
  deleteTask,
  findTask,
  completeTask,
  pasueTask,
  resumeTask,
  updateTask,
  unassignSensor,
  getLogs
}
