import *  as  winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, json, align } = winston.format;

//save received data from mqtt broker by day
const transport1: DailyRotateFile = new DailyRotateFile({
    filename: './logs/subcriber/info/%DATE%.log',
    zippedArchive: true,
    datePattern: 'YYYY-MM-DD',
});

//save error/exception from by day
const transport2: DailyRotateFile = new DailyRotateFile({
    filename: './logs/subcriber/error/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    level: 'error'
});



winston.loggers.add('subLogger', {
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        align(),
        printf((info: any) => `[${info.timestamp}] : ${info.message}`)
    ),
    transports: [
        transport1,
        transport2
    ],
});


const subLogger = winston.loggers.get('subLogger');

export { subLogger }