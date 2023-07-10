import { CalibrateSensorInput, DeviceInput, EditDeviceInput, SensorType } from "../models/device.modal"
import { ConfigSend } from "../models/mqtt.modals";
import mqttClient from "../mqtt/mqttClient";


const sendConfigure = async (deviceId: string, config: ConfigSend) => {
    try {
        await mqttClient.sendMessage(`CFG,REQ,${config.taskId},${config.msgTimeUTC},${config.startTimeUTC},${config.endTimeUTC},${config.logPeriod}`, `ToSensor/${deviceId}`);
    }
    catch(e) {
        console.log(e);
    }
}
const resumeTask = async (deviceId: string, taskId: number) => {
    try {
        await mqttClient.sendMessage(`CFG,RESUME,${taskId}`, `ToSensor/${deviceId}`);
    }
    catch(e) {
        console.log(e);
    }
}
const pauseTask = async (deviceId: string, taskId: number) => {
    try {
        await mqttClient.sendMessage(`CFG,PAUSE,${taskId}`, `ToSensor/${deviceId}`);
    }
    catch(e) {
        console.log(e);
    }
}
const stopTask = async (deviceId: string, taskId: number) => {
    try {
        await mqttClient.sendMessage(`CFG,STOP,${taskId}`, `ToSensor/${deviceId}`);
    }
    catch(e) {
        console.log(e);
    }
}

const pauseDevice = stopTask

const resumeDevice = resumeTask


const calibrate = async (deviceId : string , config : CalibrateSensorInput) =>{
    try {
       const result =  await mqttClient.sendAndExpect(`CAL,${config.gasType}, ${config.calType}, ${config.calValue}`, `ToSensor/${deviceId}`)
       return result
    }
    catch(e) {
        throw new Error("No or invalid response from sensor");
    }

}

const read = async (deviceId : string , sensorType : SensorType) =>{

    try {
        const result =  await mqttClient.sendAndExpect(`READ,${sensorType}`, `ToSensor/${deviceId}`)
        return result
    }
    catch(e) {
        throw new Error("No or invalid response from sensor");
    }

}



export default {
    sendConfigure,
    resumeTask,
    pauseTask,
    stopTask,
    pauseDevice,
    calibrate,
    read,
    resumeDevice
}