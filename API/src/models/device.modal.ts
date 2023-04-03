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