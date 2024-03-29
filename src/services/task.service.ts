import { LogOutput, LogQuery, Task, TaskEditInput, TaskInput } from "../models/task.model"
import { prisma } from "../../prisma/prismaClient"
import { ConfigSend } from "../models/mqtt.modals";
import mqttService from "./mqtt.service";
import errorHandler from "../utils/errorHandler"
import redisClient from "../redis/redisClient";
import { Device_Task } from ".prisma/client";
import { Prisma } from "@prisma/client";



// This is because bigInt type does not have native support , need to convert bigInt to number 
declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Unreachable code error
BigInt.prototype.toJSON = function (): number {
  return Number(this);
};


const createTask = async (task: TaskInput, user: string | undefined): Promise<Task | undefined> => {
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
    throw ({ name: 'ValidationError', message: { endTime: ["endTime must be later than startTime"] } });
  }

  console.log({
    ...task,
    createUser: user,
    createdUTC: (new Date()).toISOString()
  })

  try {
    const newTask = await prisma.task.create({
      data: {
        ...task,
        flowRate: new Prisma.Decimal(task.flowRate),
        createUser: user,
        createdUTC: (new Date()).toISOString()
      }
    })
    return newTask

  }
  catch (e: any) {
    console.log(e)
  }
}

const assignSensor = async (taskId: number, deviceId: string): Promise<Device_Task | undefined> => {
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

    const device = await prisma.device.findUniqueOrThrow({
      where: {
        id: deviceId,
      }
    })



    const config: ConfigSend = {
      taskId: taskId,
      msgTimeUTC: Math.floor(Date.now() / 1000),
      startTimeUTC: Math.floor(new Date(task.startTime).getTime() / 1000),
      endTimeUTC: Math.floor(new Date(task.endTime).getTime() / 1000),
      logPeriod: task.logPeriod,
      flowRate: new Prisma.Decimal(task.flowRate),
      deviceName: device.name,
      taskName: task.name
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

const unassignSensor = async (taskId: number, deviceId: string): Promise<void> => {
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

    await prisma.log.deleteMany({
      where: {
        taskId: taskId,
        deviceId: deviceId
      }
    })

  }
  catch (e: any) {
    errorHandler(e)

  }
}

const updateTask = async (taskId: string, input: TaskEditInput): Promise<Task | undefined> => {

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

    const deviceList = updatedTask.Device.map(a => ({
      id: a.Device.id,
      name: a.Device.name
    }))

    const config = {
      taskId: updatedTask.id,
      msgTimeUTC: Math.floor(Date.now() / 1000),
      startTimeUTC: Math.floor(new Date(updatedTask.startTime).getTime() / 1000),
      endTimeUTC: Math.floor(new Date(updatedTask.endTime).getTime() / 1000),
      logPeriod: updatedTask.logPeriod,
      flowRate: updatedTask.flowRate,
    }

    for (const device of deviceList) {
      await mqttService.sendConfigure(device.id, {
        ...config,
        deviceName: device.name,
        taskName: updatedTask.name
      }
      )
    }

    return newTaskDetail
  }
  catch (e: any) {
    errorHandler(e)
  }
}

const findAllTask = async (option?: any): Promise<Task[] | undefined> => {
  const company = option?.company
  const tasks = await prisma.task.findMany({
    where: {
      ...(company ? { company: company } : {})
    }
  })
  return tasks;
}

const deleteTask = async (taskId: number): Promise<void> => {
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

    await prisma.task.delete({
      where: {
        id: taskId,
      },
    })

  }
  catch (e: any) {
    errorHandler(e)
  }

}

const findTask = async (taskId: number): Promise<Task | undefined> => {
  try {
    const cacheResults = await redisClient.get(`${taskId}`);
    if (cacheResults) {
      return JSON.parse(cacheResults);
    }
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
    if (task.status === "COMPLETED") {
      await redisClient.set((`${taskId}`), JSON.stringify(task));

    }
    return task
  }
  catch (e: any) {
    errorHandler(e)

  }
}

const completeTask = async (taskId: number, username: string | undefined): Promise<Task | undefined> => {
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

const pasueTask = async (taskId: number, username: string | undefined): Promise<void> => {
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
  }
  catch (e: any) {
    errorHandler(e)
  }
}

const resumeTask = async (taskId: number, username: string | undefined): Promise<void> => {
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
  }
  catch (e: any) {
    errorHandler(e)
  }
}

const getLogs = async (taskId: number, query: LogQuery): Promise<any[] | undefined> => {
  const type = query.type ? query.type : null
  const deviceList: string[] = query.deviceList ? JSON.parse(query.deviceList) : null
  const from = query.from ? parseInt(query.from) : null
  const to = query.to ? parseInt(query.to) : null
  const cacheEligible = !deviceList && !from && !to

  try {
    if (cacheEligible) {
      const cacheResults = await redisClient.get(`${taskId}-${type ? type : ''}`);
      if (cacheResults) {
        return JSON.parse(cacheResults);
      }
    }

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

    const currentDevices = task.Device.map(a => ({ id: a.Device.id, name: a.Device.name }))

    const logs = await prisma.log.findMany({
      where: {
        taskId: taskId,
        ...(type && { logType: type }),
        ...(deviceList && {
          deviceId: {
            in: deviceList
          }
        }),
        ...(from &&
        {
          timestampUTC: {
            gte: from
          }
        }),
        ...(to &&
        {
          timestampUTC: {
            lte: to
          }
        }),
      },
      orderBy: [
        {
          timestampUTC: 'asc',
        },
      ],
    })


    const editLogs = logs.map(a => ({
      ...a,
      deviceName: currentDevices.find(b => b.id === a.deviceId)?.name,
      taskName: task.name
    }))


    if (task.status === "COMPLETED" && cacheEligible) {
      await redisClient.set((`${taskId}-${type ? type : ''}`), JSON.stringify(editLogs));
    }


    return editLogs
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
