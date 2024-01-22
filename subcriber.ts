import { PrismaClient } from '@prisma/client'
import * as mqtt from 'mqtt'
import config from './src/utils/config'
import { subLogger } from './src/utils/logger';
import { Prisma } from '@prisma/client'


const prisma = new PrismaClient()




type MQTTMessageData = { 
    CO2?: CO2,
    CH4?: CH4,
    O2?: O2,
    Temp?: Temp,
    Pressure?: Pressure,
    BAR?: BAR,
    RH?: RH
}

interface MQTTMessage extends MQTTMessageData {
    taskId: number,
    timestampUTC: number,
}

type CO2 = {
    logValue: number,
    logNote: string
}

type O2 = CO2
type CH4 = CO2
type Temp = CO2
type Pressure = CO2
type BAR = CO2
type RH = CO2

const client = mqtt.connect({
    host: config.MQTT,
    port: 1883,
    protocol: "mqtt",
    clean: false,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8)
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

export type RawLog = {
    taskId: number,
    timestampUTC: number,
    logType: string,
    logValue: number,
    logNote: string,
}

type Check = {
    taskId: number;
    timestampUTC: number;
    deviceId: string;
}

let logData: Log[] = []
let n: number = 0

async function main(data: string, topic: string) {

    let isJSON = true;
    let parsedData: RawLog[] = []

    try {
        parsedData = JSON.parse(data)
    }
    catch (e) {
        isJSON = false
    }

    if (isJSON) {
        const deviceId = topic.split('/')[1]
        const log: Log[] = parsedData.map(a => ({ ...a, deviceId: deviceId }))
        logData.concat(log)
        return;
    }

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

// If the Log MQTT messages are in JSON format 
const dataExtract = (data: MQTTMessage, topic: string) : Log[] => {
    const allData = {
        ...data,
        deviceId: topic.split('/')[1]
    }

    const data1 : MQTTMessageData =  (({ CO2, O2, CH4, BAR, RH, Temp, Pressure }) => ({ CO2, O2, CH4, BAR, RH, Temp, Pressure }))(allData);

    const dataList: Log[] = []

    const dataType = ['CO2', 'O2', 'CH4', 'BAR', 'RH', 'Temp', 'Pressure'] as (keyof typeof data1)[]

    for ( let i = 0 ;i < dataType.length; i ++ ){
        if (dataType[i] in  data1 ){
            dataList.push({
                taskId: allData.taskId,
                timestampUTC: allData.timestampUTC,
                logType: dataType[i],
                logValue: data1[dataType[i]]?.logValue as number,
                logNote: data1[dataType[i]]?.logNote as string,
                deviceId: allData.deviceId
            })
        }
    }

    return dataList


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
        taskId: parseInt(value[3]),
        timestampUTC: parseInt(value[4]),
        logType: value[5],
        logValue: parseFloat(value[6]),
        logNote: value[7],
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





