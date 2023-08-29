import { Prisma } from '@prisma/client'
import { prisma } from './prisma/prismaClient'
import { Log } from './subcriber'

const a = async () => {
    try {
        const logs: any[] = await prisma.log.findMany({})
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

const logs: Log[] = [{
    taskId: 1,
    timestampUTC: 1,
    logType: "test",
    logValue: 1,
    logNote: "",
    deviceId: "AAAAA"
},
{
    taskId: 1,
    timestampUTC: 1,
    logType: "test",
    logValue: 1,
    logNote: "",
    deviceId: "AAAAA"
}]

const c = async () => {
    try {
        const values = logs.map((log) =>`('${log.timestampUTC}', '${log.logNote}', '${log.taskId}', '${log.deviceId}',' ${log.logValue}', '${log.logType}')`)
        const a = await prisma.$queryRaw`INSERT INTO "Log" (timestampUTC,logNote,taskId,deviceId,logValue,logType) 
        VALUES 
         ${values.join(',')}`
         console.log(a)

        // const query =
        //     await prisma.$executeRaw`insert into defaultdb.Log ("timestampUTC","logNote","taskId","deviceId","logValue","logType" )
        // values
        // ('1692255425','','4','bn51x3','8727','test'),('1692255426','','3','pZomwS','5101','test')`

    }
    catch (e) {
        console.error(e)
    }
}


a()