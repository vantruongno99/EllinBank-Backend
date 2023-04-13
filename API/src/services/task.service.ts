import { TaskEditInput, TaskInput } from "../models/task.model"
import { prisma } from "../../prisma/prismaClient"
import { ConfigSend } from "../models/mqtt.modals";
import mqttService from "./mqtt.service";


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
    if (e.meta.target) {
      throw ({ name: 'ValidationError', message: `${e.meta.target} is not unique` });
    }
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

    const config : ConfigSend = {
      taskId: taskId,
      msgTimeUTC: Math.floor(Date.now() / 1000),
      startTimeUTC: Math.floor(new Date(task.startTime).getTime() / 1000),
      endTimeUTC : Math.floor(new Date(task.endTime).getTime() / 1000),
      logPeriod: task.logPeriod,
    }

    mqttService.sendConfigure(deviceId,config);
    return deviceTask


  }
  catch (e: any) {
    if (e.meta.target) {
      throw ({ name: 'ValidationError', message: `${e.meta.target} is not unique` });
    }
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
    mqttService.stopTask(deviceId,taskId);

  }
  catch (e: any) {
    if (e.meta.target) {
      throw ({ name: 'ValidationError', message: `${e.meta.target} is not unique` });
    }
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

    const config : ConfigSend = {
      taskId: updatedTask.id,
      msgTimeUTC: Math.floor(Date.now() / 1000),
      startTimeUTC: Math.floor(new Date(updatedTask.startTime).getTime() / 1000),
      endTimeUTC : Math.floor(new Date(updatedTask.endTime).getTime() / 1000),
      logPeriod: updatedTask.logPeriod,
    }

    for (const deviceId of deviceList) {
      await mqttService.sendConfigure(deviceId,config)
    }

    return newTaskDetail
  }
  catch (e: any) {
    throw ({ name: 'ValidationError', message: JSON.stringify(e) });
  }
}

const findAllTask = async () => {
  const tasks = await prisma.task.findMany()
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

      deviceList.forEach(async (deviceId) => {
        await mqttService.stopTask(deviceId,taskId)
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
    throw ({ name: 'ValidationError', message: JSON.stringify(e) });
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
    throw ({ name: 'ValidationError', message: "Not Found" });

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
            Device: true
          }
        }
      },

    })

    if (task.status != "COMPLETED") {
      throw ({ name: 'ValidationError', message: { taskId: ["Complete failed"] } });
    }


    const deviceList = task.Device.map(a => a.Device.id)

    deviceList.forEach(async (deviceId) => {
      await mqttService.stopTask(deviceId, taskId)
    })


    return task
  }
  catch (e: any) {
    throw ({ name: 'ValidationError', message: "Not Found or Already Completed" });
  }
}

const pasueTask = async (taskId: number, username: string | undefined) => {
  try {

    await prisma.task.findFirstOrThrow({
      where: {
        id: taskId,
        status: {
          equals: "STARTED"
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

    deviceList.forEach(async (deviceId) => {
      await mqttService.pauseTask(deviceId, taskId)
    })


    return task
  }
  catch (e: any) {
    throw ({ name: 'ValidationError', message: "Not Found or Already Paused" });
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
        status: "STARTED"
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

    if (task.status != "STARTED") {
      throw ({ name: 'ValidationError', message: { taskId: ["RESUME failed"] } });
    }


    const deviceList = task.Device.map(a => a.Device.id)

    deviceList.forEach(async (deviceId) => {
      await mqttService.resumeTask(deviceId, taskId)
    })

    return task
  }
  catch (e: any) {
    throw ({ name: 'ValidationError', message: "Not Found or Already RUNNING" });
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
  unassignSensor
}
