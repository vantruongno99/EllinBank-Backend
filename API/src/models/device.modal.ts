import { Task } from "./task.model";

export interface DeviceInput {
  name: string;
  id: string;
}

export interface Device {
  id: string
  name: string
  lastCheck: Date | null
  updateUTC: Date | null
  status: string
  assigned: boolean
  CH4_SN: string | null
  O2_SN: string | null
  CO2_SN: string | null
  PUMP_SN: string | null,
  Task?: {
    Task: Task;
}[]
}

export interface EditDeviceInput {
  name: string
  id: string
  CH4_SN: string | null
  O2_SN: string | null
  CO2_SN: string | null
  PUMP_SN: string | null
}

export interface CalibrateSensorInput {
  gasType: GasType,
  calType: CAlType,
  calValue: number
}



export const SensorTypes = ['CO2', 'CH4', 'O2', 'TEMP', 'RH', 'BAR']

export type SensorType = typeof SensorTypes[number]

export const GasTypes = ['CO2', 'CH4']

export type GasType = typeof GasTypes[number]

export const CalTypes = ['ZERO', 'SPAN']

export type CAlType = typeof GasTypes[number]
