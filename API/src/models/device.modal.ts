export interface DeviceInput {
    name: string;
    id: string;
}

export interface Device {
    id: string
    name: string
    CH4_SN: string 
    O2_SN: string 
    CO2_SN: string 
    PUMP_SN: string 
  }

  export interface EditDeviceInput {
    name: string
    id: string
    CH4_SN: string 
    O2_SN: string 
    CO2_SN: string 
    PUMP_SN: string 
  }

  export interface CalibrateSensorInput {
    gasType : GasType,
    calType : CAlType,
    calValue : number
  }

  export const SensorTypes = ['CO2','CH4', 'O2', 'TEMP', 'RH', 'BAR']  

  export type SensorType = typeof SensorTypes[number]

  export const GasTypes = ['CO2', 'CH4']

  export type GasType = typeof GasTypes[number]

  export const CalTypes = ['ZERO', 'SPAN']

  export type CAlType = typeof GasTypes[number]
