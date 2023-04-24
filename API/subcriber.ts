import { PrismaClient } from '@prisma/client'
import mqtt from 'mqtt'


const prisma = new PrismaClient()
var client = mqtt.connect("mqtt://localhost")

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
    switch(type){
        case "LOG": console.log("loh")
    }
    const test:Log = logMessageHandle(data, topic)
    if (test.taskId) {
         const res =  await prisma.log.create({
            data: test
        })          

        console.log(res)
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


