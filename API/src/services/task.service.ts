import { TaskInput } from "../models/task.model"
import { prisma } from "../../prisma/prismaClient"

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


  try {
    const newTask = await prisma.task.create({
      data: {
        name,
        startTime: new Date(),
        endTime: new Date(),
        createUser: user
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

const assignSensor = async (taskId: string, sensorId: string) => {
  if (!taskId) {
    throw ({ name: 'ValidationError', message: { email: ["can't be blank"] } });
  }

  if (!sensorId) {
    throw ({ name: 'ValidationError', message: { username: ["can't be blank"] } });
  }

  try {
    const newTask = await prisma.sensorOnTask.create({
      data: {
        taskId,
        sensorId
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

const findAllTask = async () => {
  const tasks = await prisma.task.findMany(
    {
      include: {
        Sensor: {
          select: {
            sensorId: true
          }
        }
      },
    }

  )
  return tasks;
}

const deleteTask = async (taskId: string) => {
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

const findTask = async (taskId: string) => {
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


export default { createTask, assignSensor, findAllTask, deleteTask ,findTask}
