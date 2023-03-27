import { PrismaClient } from '@prisma/client'
import mqtt from 'mqtt'
import { Log } from './types'

const prisma = new PrismaClient()
var client = mqtt.connect("mqtt://localhost")



async function main(data: any, topic: string) {
    const test:Log = logMessageHandle(data, topic)
    if (test.taskId) {
         const qwe =  await prisma.log.create({
            data: test
        })
        console.log(qwe)
          
    }
}

function messsageReceived(topic: string, message: any, packet: string) {
    try {
        const data = message.toString();
        main(data, topic)
    }
    catch (err: any) {
        console.log(err)
    }
};

const typeofMessage = (message: String) => {
    const type = message.split(',')[0]
    if (type !== "CFG") {
        return `${message.split(',')[0]},${message.split(',')[1]}`
    }
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

const CalMessageHandle = (message: String, topic: String) => {
    const value: string[] = message.split(',')
    return ({
        Status: parseInt(value[1]),
        timestampUTC: parseInt(value[2]),
        gasType: value[3],
        calType: value[4],
        setValue: value[5],
        measVal: value[6],
        deviceId: topic
    })
}

client.on("connect", function () {
    console.log("connected");
})

client.on('message', messsageReceived);


client.subscribe('#');

setInterval(() => {
    const obj = "LOG,1,1000000,test,10,"
    publish('ToSensor/AAAAAA', obj);
}, 500);

//publish function
const publish = (topic: string, msg: string) => {
    console.log("publishing", msg);
    if (client.connected == true) {
        client.publish(topic, msg);
    }
}


