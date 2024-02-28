import { CalibrateSensorInput, DeviceInput, EditDeviceInput, SensorType } from "../models/device.modal"
import { ConfigSend } from "../models/mqtt.modals";
import mqttClient from "../mqtt/mqttClient";

// Send task configure message to mqtt broker 
const sendConfigure = async (deviceId: string, config: ConfigSend) => {
    try {
        await mqttClient.sendMessage(`CFG;REQ;${config.taskId};${config.taskName};${config.msgTimeUTC};${config.startTimeUTC};${config.endTimeUTC};${config.logPeriod};${config.flowRate};${config.deviceName}`, `ToSensor/${deviceId}`);
    }
    catch(e) {
        console.log(e);
    }
}
// Send task resume message to mqtt broker
const resumeTask = async (deviceId: string, taskId: number) => {
    try {
        await mqttClient.sendMessage(`CFG;RESUME;${taskId}`, `ToSensor/${deviceId}`);
    }
    catch(e) {
        console.log(e);
    }
}
// Send task pause message to mqtt broker
const pauseTask = async (deviceId: string, taskId: number) => {
    try {
        await mqttClient.sendMessage(`CFG;PAUSE;${taskId}`, `ToSensor/${deviceId}`);
    }
    catch(e) {
        console.log(e);
    }
}
// Send task stop message to mqtt broker
const stopTask = async (deviceId: string, taskId: number) => {
    try {
        await mqttClient.sendMessage(`CFG;ERASE;${taskId}`, `ToSensor/${deviceId}`);
    }
    catch(e) {
        console.log(e);
    }
}

const pauseDevice = stopTask

const resumeDevice = resumeTask

// Send calibrate configure message to mqtt broker
const calibrate = async (deviceId : string , config : CalibrateSensorInput) =>{
    try {
       const result =  await mqttClient.sendAndExpect(`CFG;CAL;${config.gasType};${config.calType};${config.calValue}`, `ToSensor/${deviceId}`)
       return result
    }
    catch(e) {
        throw new Error("No or invalid response from sensor");
    }

}
// Send calibrate read message to mqtt broker
const read = async (deviceId : string , sensorType : SensorType) =>{

    try {
        const result =  await mqttClient.sendAndExpect(`CFG;READ;${sensorType}`, `ToSensor/${deviceId}`)
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