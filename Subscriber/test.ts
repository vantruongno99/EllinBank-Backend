import mqttClient from "./mqtt/mqttClient";

const c = async () => {

    try {


        let [someResult, anotherResult] = await Promise.all([mqttClient.expectMessage('222222222'), await mqttClient.sendMessage('2222222222', '2222222223')]);

        console.log(someResult)
    }

    catch (err) {
        console.log("failed")
    }


}

const d = async () => {


    let [someResult, anotherResult] = await Promise.all([mqttClient.expectMessage('11111111111'), await mqttClient.sendMessage('11111111111', '11111111111')]);

    console.log(someResult)


}

const b = async () => {
    await c()
    await d()
}


setTimeout(async () => b(), 5000)


