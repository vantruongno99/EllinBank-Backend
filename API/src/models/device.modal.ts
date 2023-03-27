export interface DeviceInput {
    name: string;
    id: string;
}

export interface Device {
    id: string
    name: string
    CH4_SN: string | null
    O2_SN: string | null
    CO2_SN: string | null
    PUMP_SN: string | null
  }

  export interface EditDeviceInput {
    name: string
    id: string
    CH4_SN: string | null
    O2_SN: string | null
    CO2_SN: string | null
    PUMP_SN: string | null
  }