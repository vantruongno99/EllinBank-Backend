export interface TaskInput {
    startTime: Date
    endTime: Date,
    name : string,
    logPeriod : number,
    status? : string
}

export interface TaskEditInput {
    startTime: Date
    id: number,
    name : string,
    logPeriod : number,
    comment : string,
}

export interface LogQuery {
    deviceId? : string[],
    from? : string,
    to? : string,
    type? : string
}
