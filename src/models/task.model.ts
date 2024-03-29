import { Prisma } from "@prisma/client";
import { Device } from "./device.modal";

export interface TaskInput {
    startTime: Date
    endTime: Date,
    name : string,
    logPeriod : number,
    status? : string
    flowRate :  Prisma.Decimal
}

export interface TaskEditInput {
    startTime: Date
    id: number,
    name : string,
    logPeriod : number,
    comment : string,
    flowRate : Prisma.Decimal

}

export interface LogQuery {
    deviceList? : string,
    from? : string,
    to? : string,
    type? : string
}

export interface LogOutput {
    deviceName: string;
    taskName: string;
    id?: number;
    dateTimeUTC: Date;
    timestampUTC: bigint;
    deviceId: string;
    taskId: number;
    logType: string;
    logValue: number;
    logNote: string;
    flowRate : Prisma.Decimal

}

export type Task = {
    flowRate : Prisma.Decimal
    id: number
    startTime: Date
    endTime: Date
    createdUTC: Date
    completedUTC: Date | null
    comment: string
    name: string
    logPeriod: number
    status: string
    createUser: string
    completeUser: string | null
    company: string | null,
    Device?: {
        Device: Device;
    }[]
  }

