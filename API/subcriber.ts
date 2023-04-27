import { PrismaClient } from '@prisma/client'
import mqtt from 'mqtt'
import config from './src/utils/config'


const prisma = new PrismaClient()
var client = mqtt.connect(config.MQTT)

export type Log = {
    taskId: number,
    timestampUTC: number,
    logType: string,
    logValue: number,
    logNote: string,
    dateTimeUTC: Date,
    deviceId: string
}


async function main(data: any, topic: string) {
    const type = typeofMessage(data)
    switch (type) {
        case "LOG": {
            const test: Log =  logMessageHandle(data, topic)
            await addLog(test)
        }
    }

}

const addLog = async (log: Log) => {
    if (log.taskId) {
        const res = await prisma.log.create({
            data: log
        })

        console.log(res)
    }
}

function messsageReceived(topic: string, message: any, packet: string) {
    try {
        const data = message.toString();
        console.log(data)
        console.log(topic)
        main(data, topic)
    }
    catch (err: any) {
        console.log(err)
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
        dateTimeUTC: new Date(),
        deviceId
    })
}
const checkMessageHandle = (message: String, topic: String) => {
    const value: string[] = message.split(',')
    return ({
        taskId: parseInt(value[1]),
        timestampUTC: parseInt(value[2]),
        deviceId: topic
    })
}


client.on("connect", function () {
    console.log("connected");
})

client.on('message', messsageReceived);


client.subscribe('ToServer/#');


setInterval(() => {
    const d = new Date();
    let time = d.getTime()/1000;
    const obj = `LOG,1,${time},test,${Math.floor(Math.random() * 10000)},`
    publish('ToServer/AAAAAA', obj);
}, 500);

//publish function
const publish = (topic: string, msg: string) => {
    if (client.connected == true) {
        client.publish(topic, msg);
    }
}


