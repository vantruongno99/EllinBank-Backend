import { PrismaClient } from '@prisma/client'
const MQTT = require("async-mqtt");
import config from './src/utils/config'
import { subLogger } from './src/utils/logger';
import { Prisma } from '@prisma/client'
import winston from 'winston';
import fs from 'fs';

const { combine, timestamp, printf, json, align } = winston.format;


const client = MQTT.connect(`mqtt://170.64.187.153`, {
    port: 1883,
})

const logger1 = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'messageSent.log' })
    ],
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        align(),
        printf((info: any) => `[${info.timestamp}] : ${info.message}`)
    ),
});

const logger2 = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'messageReceived.log' })
    ]
    ,
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        align(),
        printf((info: any) => `[${info.timestamp}] : ${info.message}`)
    ),
});

let messageSent = 0;
let messageReceived = 0;
const limit = 180000

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

//  client.on('message', messsageReceived);


//  client.subscribe('ToServer/#',{qos:0});


client.on('error', (err: any) => {
    subLogger.error(JSON.stringify(err))
})

const publish = async (topic: string, message: string) => {
    try {
        if (client.connected == true) {
            if (messageSent >= limit) {
                return;
            }
            messageSent++;

            const newMsg = `${messageSent} - ${message}`

            await client.publish(topic,message)

            logger1.info(`${topic} - ${message}`)

            console.log(messageSent, "messageSent")
        }
    } catch (e) {
        console.group(e)
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

const deviceList = Array.from({ length: 2 }, () => generateRandomString(6));


setInterval(() => {
    const d = new Date();
    let time = d.getTime() ;
    const objectList = Array.from({ length: 40 }, () => `LOG,56,${time},test,${Math.floor(Math.random() * 10000)},`);


    for (const device of deviceList) {
        publish(`ToServer/${device}`, objectList[Math.floor(Math.random() * 40)])
    }

}, 1000);






