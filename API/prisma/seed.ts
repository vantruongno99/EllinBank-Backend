import { PrismaClient } from '@prisma/client'
import userService from '../src/services/user.service';
const prisma = new PrismaClient()
async function main() {
    try {
        const user = await userService.createUser({
            username: "test",
            email: "test@gmail.com",
            password: "12345678"
        });
        console.log(user)
    }
    catch (e: any) {
        console.log(e)
    }

    try {
        const newDevice = await prisma.device.create({
            data: {
                id: "AAAAAA",
                name: "AAAAAA"
            }
        })
        console.log(newDevice)

    }
    catch (e: any) {
        console.log(e)
    }

    try {
        const newTask = await prisma.task.create({
            data: {
                name: "test",
                startTime: new Date(),
                endTime: new Date(),
                createUser: "test"
            }
        })
        console.group(newTask)
    }
    catch (e: any) {
        console.log(e)
    }

   
}

    main()
        .then(async () => {
            await prisma.$disconnect()
        })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })