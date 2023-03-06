export interface SensorInput {
    name: string;
    code: string;
}

export interface Sensor {
    id: string
    name: string
    code: string
    CH4_SN: string | null
    O2_SN: string | null
    CO2_SN: string | null
    PUMP_SN: string | null
  }

  export interface EditSensorInput {
    name: string
    code: string
    CH4_SN: string | null
    O2_SN: string | null
    CO2_SN: string | null
    PUMP_SN: string | null
  }