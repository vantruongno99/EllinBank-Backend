import { Prisma } from "@prisma/client";

export interface ConfigSend {
    taskId: number,
    taskName : string,
    deviceName : string;
    msgTimeUTC: number,
    startTimeUTC: number,
    endTimeUTC : number,
    logPeriod: number,
    flowRate :  Prisma.Decimal
}

