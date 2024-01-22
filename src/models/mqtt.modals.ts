import { Prisma } from "@prisma/client";

export interface ConfigSend {
    taskId: number,
    msgTimeUTC: number,
    startTimeUTC: number,
    endTimeUTC : number,
    logPeriod: number,
    flowRate :  Prisma.Decimal
}

