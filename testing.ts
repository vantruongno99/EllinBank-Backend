import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


const a = async () =>{
    try{
        const B = await prisma.log.findMany({
            where:{
                taskId : 22
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