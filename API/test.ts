import { PrismaClient } from '@prisma/client'
import mqtt from 'mqtt'
import config from './src/utils/config'
import { subLogger } from './src/utils/logger';
import { Prisma } from '@prisma/client'
import winston from 'winston';
import fs from 'fs';

const client = mqtt.connect(`mqtts://${config.MQTT}`, {
    port: 8883,
    keepalive: 10,
    ca: fs.readFileSync('certs/ca.crt'),
    cert: fs.readFileSync('certs/server.crt'),
    key: fs.readFileSync('certs/server.key'),
    rejectUnauthorized: false,
})

const logger1 = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'messageSent.log' })
    ]
});

const logger2 = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'messageReceived.log' })
    ]
});

let messageSent = 0;
let messageReceived = 0;
const limit = 100000

export type Log = {
    taskId: number,
    timestampUTC: number,
    logType: string,
    logValue: number,
    logNote: string,
    dateTimeUTC: Date,
    deviceId: string
}


function messsageReceived(topic: string, message: any, packet: string) {
    try {
        const data = message.toString();
        subLogger.info(`${topic} - ${data}`)
        messageReceived++
        logger2.info(`${topic} - ${message}`)
        console.log(messageReceived, "messageRecevied")
    }
    catch (err: any) {
        subLogger.error(JSON.stringify(err))
    }
};


client.on("connect", function () {
    console.log("Sub connected");
})

client.on('message', messsageReceived);


client.subscribe('ToServer/#');


client.on('error', (err) => {
    subLogger.error(JSON.stringify(err))
})

const publish = (topic: string, msg: string) => {
    if (client.connected == true) {
        if (messageSent === limit) {
            return;
        }
        client.publish(topic, msg, (err) => {
            messageSent++;
            logger1.info(`${topic} - ${msg}`)
            console.log(messageSent, "messageSent")
            if (err instanceof Error) {
                subLogger.error(JSON.stringify(err))
            }
        });
    }
}

function generateRandomString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

const deviceList = Array.from({ length: 10000 }, () => generateRandomString(6));


setInterval(() => {
    const d = new Date();
    let time = Math.trunc(d.getTime() / 1000);
    const objectList = Array.from({ length: 40 }, () => `LOG,${Math.floor(Math.random() * 10)},${time},test,${Math.floor(Math.random() * 10000)},`);

    deviceList.forEach(device => publish(`ToServer/${device}`, objectList[Math.floor(Math.random() * 40)]))
}, 100);






