import { PrismaClient } from '@prisma/client'
import userService from '../src/services/user.service';
const prisma = new PrismaClient()
async function main() {

    try {
        const company = await prisma.company.create({
            data: {
                name: "CTI"
            }
        })
    }
    catch (e: any) {
        console.log(e)
    }


    try {
        const user = await userService.createUser({
            username: "super",
            email: "super@gmail.com",
            password: "12345678",
            role: "admin",
            company : "CTI"
        });
        console.log(user)
    }
    catch (e: any) {
        console.log(e)
    }


    try {
        const newDevice = await prisma.device.createMany({
            data: [{
                id: "test",
                name: "test"
            }]
        })
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