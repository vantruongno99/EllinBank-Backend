import { TaskInput } from "../models/task.model"
import { prisma } from "../../prisma/prismaClient"
import MqttHandler from "../mqtt/MqttHandler"

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



  var mqttClient = new MqttHandler();
  mqttClient.connect();

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

    await mqttClient.sendMessage(`CFG,REQ,${taskId},${Math.floor(Date.now() / 1000)},${Math.floor(new Date(task.startTime).getTime() / 1000)},${Math.floor(new Date(task.endTime).getTime() / 1000)},${task.logPeriod}`, `ToSensor/${deviceId}`);
    return deviceTask


  }
  catch (e: any) {
    if (e.meta.target) {
      throw ({ name: 'ValidationError', message: `${e.meta.target} is not unique` });
    }
  }
  finally {
    await mqttClient.close()
  }
}

const findAllTask = async () => {
  const tasks = await prisma.task.findMany()
  return tasks;
}

const deleteTask = async (taskId: number) => {
  try {
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
    })
    return task
  }
  catch (e: any) {
    throw ({ name: 'ValidationError', message: JSON.stringify(e) });

  }
}


export default { createTask, assignSensor, findAllTask, deleteTask, findTask }
