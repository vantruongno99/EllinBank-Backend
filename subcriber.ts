import { PrismaClient } from '@prisma/client'
import * as mqtt from 'mqtt'
import config from './src/utils/config'
import { subLogger } from './src/utils/logger';
import { Prisma } from '@prisma/client'


const prisma = new PrismaClient()

const client = mqtt.connect({
    host: config.MQTT,
    port: 1883,
    protocol: "mqtt",
    clean : false,
    clientId :  'mqttjs_' + Math.random().toString(16).substr(2, 8)
    // port: 8883,
    //protocol :"mqtts",
    // keepalive: 10,
    // ca: fs.readFileSync('certs/ca.crt'),
    // cert: fs.readFileSync('certs/server.crt'),
    // key: fs.readFileSync('certs/server.key'),
    // rejectUnauthorized: false,
})

export type Log = {
    taskId: number,
    timestampUTC: number,
    logType: string,
    logValue: number,
    logNote: string,
    deviceId: string
}

type Check = {
    taskId: number;
    timestampUTC: number;
    deviceId: string;
}

let logData: Log[] = []
let n: number = 0

async function main(data: any, topic: string) {
    const type = typeofMessage(data)
    switch (type) {
        case "LOG":
            const log: Log = logMessageHandle(data, topic)
            logData.push(log)
            break;

        case "CHK":
            const check: Check = checkMessageHandle(data, topic)
            await addCheck(check)
            break;

        default: {

        }
    }

}

const addLogs = async (logs: Log[]) => {
    try {
        const values = logs.map((log) => `('${log.timestampUTC}', '${log.logNote}', '${log.taskId}', '${log.deviceId}',' ${log.logValue}', '${log.logType}')`)
        await prisma.$queryRawUnsafe(`INSERT INTO "Log" (timestampUTC,logNote,taskId,deviceId,logValue,logType) 
        VALUES 
         ${values.join(',')}`)
    }
    catch (e) {
        subLogger.error(JSON.stringify(logs))
        subLogger.error(JSON.stringify(e))
        console.log(e)

    }
}

const addCheck = async (check: Check) => {
    if (check.deviceId) {
        try {
            const res = await prisma.device.update({
                where: {
                    id: check.deviceId
                },
                data: {
                    lastCheck: new Date(check.timestampUTC * 1000)
                }
            })
            subLogger.info(JSON.stringify(res))
        }
        catch (e) {
            subLogger.error(JSON.stringify(check))
            subLogger.error(JSON.stringify(e))
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                switch (e.code) {
                    case 'P2025':
                        await prisma.device.create({
                            data: {
                                id: check.deviceId,
                                name: 'default'
                            }
                        })

                    default:
                }
            }

        }
    }
}

function messsageReceived(topic: string, message: any, packet: any) {
    try {
        const data = message.toString();
        subLogger.info(`${topic} - ${data}`)
        main(data, topic)
    }
    catch (err: any) {
        subLogger.error(JSON.stringify(err))
    }
};

const typeofMessage = (message: String) => {
    const type = message.split(',')[0]
    return type
}

const logMessageHandle = (message: String, topic: String) => {
    const value: string[] = message.split(',')
    const deviceId = topic.split('/')[1]
    return ({
        taskId: parseInt(value[1]),
        timestampUTC: parseInt(value[2]),
        logType: value[3],
        logValue: parseFloat(value[4]),
        logNote: value[5],
        deviceId
    })
}
const checkMessageHandle = (message: String, topic: String) => {
    const value: string[] = message.split(',')
    const deviceId = topic.split('/')[1]
    return ({
        taskId: parseInt(value[1]),
        timestampUTC: parseInt(value[2]),
        deviceId: deviceId
    })
}


client.on("connect", function () {
    console.log("sub connected");
})

client.on('message', messsageReceived);


client.subscribe('ToServer/#', { qos: 1 });


client.on('error', (err) => {
    subLogger.error(JSON.stringify(err))
})

setInterval(() => {
    const logs: Log[] = logData;
    logData = []
    if (logs.length !== 0) {
        addLogs(logs)
    }
}, 1000)





