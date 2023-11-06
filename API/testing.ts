import { prisma } from './prisma/prismaClient'
import { Log } from './subcriber'
import taskService from './src/services/task.service'
import { LogOutput } from './src/models/task.model'
const a = async () => {
    try {
        const logs: any[] = await prisma.log.findMany({where:{
            taskId : 58
        }})

        console.log(logs.length)
    }
    catch (e) {
        console.log(e)
    }
}

const b = async () => {
    try {
        const logs = await prisma.log.deleteMany()
    }
    catch (e) {
        console.log(e)
    }
}

const c = async () => {
    const logType = "CH4"
    const deviceList = ["Device-1","Device-2"]
    const from = false
    const to = false

    try {
        const logs = await prisma.$queryRawUnsafe<LogOutput[]>(`
        SELECT Log.dateTimeUTC,Log.timestampUTC,Log.DeviceId,Device.name AS deviceName,Log.TaskId,Task.name AS taskName,Log.logType,Log.logValue,Log.logNote
        FROM Log
        INNER JOIN Device
        ON Log.DeviceId = Device.Id
        INNER JOIN Task
        ON Log.TaskId = Task.Id
        WHERE
        1 = 1
        AND Log.taskId = 42
        AND logType = 'RH'
    
    
    
    
    
        `
        )

        console.log(logs)

    }
    catch (e) {
        console.log(e)
}
}

const d = async () => {
    try {
        const logs = await prisma.$queryRawUnsafe<LogOutput[]>(`
        SELECT Log.dateTimeUTC,Log.timestampUTC,Log.DeviceId,Device.name AS deviceName,Log.TaskId,Task.name AS taskName,Log.logType,Log.logValue,Log.logNote
        FROM Log
        INNER JOIN Device
        ON Log.DeviceId = Device.Id
        INNER JOIN Task
        ON Log.TaskId = Task.Id
        WHERE
        1 = 1
        AND Log.taskId = 58
        
        `
        )

        console.log(logs.length)

    }
    catch (e) {
        console.log(e)
}
}







a()