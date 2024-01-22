import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


const a = async () =>{
    try{
        const B = await prisma.task.create({
            data : {
                name: 'rrRERWEgfdgfd43434',
                logPeriod: 4,
                startTime: '2024-01-22T04:37:36.287Z',
                endTime: '2024-01-23T04:37:36.287Z',
                company: 'CTI',
                flowRate: 2.5,
                createUser: 'super',
                createdUTC: '2024-01-22T04:41:20.551Z'
            }
        })
        console.log(B)

    }


    catch(e)
    {
        console.log(e)
    }
}

a()