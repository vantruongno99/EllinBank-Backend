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

const stopDevice = stopTask

const calibrate = async (deviceId : string , config : CalibrateSensorInput) =>{

    try {
        await mqttClient.sendMessage(`CAL,${config.gasType}, ${config.calType}, ${config.calValue}`, `ToSensor/${deviceId}`)
    }
    catch(e) {
        console.log(e);
    }

}

const read = async (deviceId : string , sensorType : SensorType) =>{

    try {
        await mqttClient.sendMessage(`READ,${sensorType}`, `ToSensor/${deviceId}`)
    }
    catch(e) {
        console.log(e);
    }

}



export default {
    sendConfigure,
    resumeTask,
    pauseTask,
    stopTask,
    stopDevice,
    calibrate,
    read
}