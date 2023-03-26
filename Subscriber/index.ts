import { PrismaClient } from '@prisma/client'
import mqtt from 'mqtt'

const prisma = new PrismaClient()
var client = mqtt.connect("mqtt://localhost")



async function main(data: any) {
    const sensor = await prisma.log.create({
        data: {
            ...data
        },
    })
    console.log(sensor)

    const getSensor = await prisma.sensor.findUnique({
        where: {
            Code: 'Test',
        },
        include: {
            Log: true,
        },
    })
    console.log(getSensor)
}

function messsageReceived(topic: string, message: any, packet: string) {
    try {
        let text = message.toString();
        main(JSON.parse(text))
    }
    catch (err: any) {
        console.log(err)
    }
};

client.on("connect", function () {
    console.log("connected");
})

client.on('message', messsageReceived);


client.subscribe('mqtt/test');

setInterval(() => {
    const obj = {
        SensorCode: 'Test',
        TimeStamp: new Date(),
        Utc: Math.floor(Date.now() / 1000),
        SensorData: JSON.stringify({ Name: 'test' })
    }
    publish('mqtt/test', JSON.stringify(obj));
}, 5000);

//publish function
const publish = (topic: string, msg: string) => {
    console.log("publishing", msg);
    if (client.connected == true) {
        client.publish(topic, msg);
    }
}

const typeofMessage = (message: String) => {
    const type = message.split(',')[0]
    if (type !== "CFG") {
        return `${message.split(',')[0]},${message.split(',')[1]}`
    }
    return type
}

const logMessageHandle = (message: String, topic: String) => {
    const value: String[] = message.split(',')
    return
    ({
        TaskId: value[1],
        msgTimeUTC: value[2],
        logType: value[3],
        logValue: value[4],
        logNote: value[5],
        SensorId: topic
    })
}
const checkMessageHandle = (message: String, topic: String) => {
    const value: String[] = message.split(',')
    return
    ({
        TaskId: value[1],
        msgTimeUTC: value[2],
        SensorId: topic
    })
}

const CalMessageHandle = (message: String, topic: String) => {
    const value: String[] = message.split(',')
    return
    ({
        Status: value[1],
        msgTimeUTC: value[2],
        gasType: value[3],
        calType: value[4],
        setValue: value[5],
        measVal: value[6],
        SensorId: topic
    })
}

