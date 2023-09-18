import { Prisma } from '@prisma/client'
import { prisma } from './prisma/prismaClient'
import { Log } from './subcriber'
import taskService from './src/services/task.service'
const a = async () => {
    try {
        const logs: any[] = await prisma.log.findMany({where:{
            taskId : 16
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





a()