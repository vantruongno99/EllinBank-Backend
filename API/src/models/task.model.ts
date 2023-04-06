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
}

