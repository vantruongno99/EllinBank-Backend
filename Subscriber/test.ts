import mqttClient from "./mqtt/mqttClient";

const c = async () => {


    let [someResult, anotherResult] = await Promise.all([mqttClient.expectMessage('222222222', '222222222'), await mqttClient.sendMessage('222222222', '222222222')]);

    console.log(someResult)


}

const d = async () => {


    let [someResult, anotherResult] = await Promise.all([mqttClient.expectMessage('1111111111', '11111111111'), await mqttClient.sendMessage('1111111111', '11111111111')]);

    console.log(someResult)


}

const b = async () => {
    await c()
    await d()
}


setTimeout(async () => b(), 5000)


setTimeout(async () => await mqttClient.expectMessage('222222222', '222222222'), 10000)