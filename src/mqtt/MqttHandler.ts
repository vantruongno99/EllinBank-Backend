import * as mqtt from 'mqtt';
import fs from 'fs';
import config from '../utils/config'
class MqttHandler {
    mqttClient: any;
    constructor() {

        this.mqttClient = mqtt.connect({
            host: config.MQTT,
            port: 1883,
            protocol: "mqtt",
            clean: false,
            clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
            // port: 8883,
            //protocol :"mqtts",
            // keepalive: 10,
            // ca: fs.readFileSync('certs/ca.crt'),
            // cert: fs.readFileSync('certs/server.crt'),
            // key: fs.readFileSync('certs/server.key'),
            // rejectUnauthorized: false,
        })
        // Mqtt error calback
        this.mqttClient.on('error', (err: any) => {
            console.log(err);
            this.mqttClient.end();
        });

        // Connection callback
        this.mqttClient.on('connect', () => {
            console.log(`mqtt client connected`);
        });

        this.mqttClient.on('close', () => {
            console.log(`mqtt client disconnected`);
        });
    }

    // Sends a mqtt message to topic: mytopic
    async sendMessage(message: string, topic: string) {
        return new Promise((resolve, reject) => {
            this.mqttClient.publish(topic, message, { qos: 1, retain: true }, (err: any, result: any) => {
                if (err) reject(err)
                else resolve(result)
            })
        })
    }

    async close() {
        await this.mqttClient.end()
    }

    async expectMessage(topicT: string, type: string) {
        const toTopic = `ToServer/${topicT.split('/')[1]}`
        const wait = () => {
            return new Promise((_, reject) => {
                setTimeout(() => {
                    this.mqttClient.unsubscribe(toTopic, function (err: any) {
                        console.log("unsubcribe")
                    });
                    reject(new Error('timeout succeeded'))
                }
                    , 5000);
            });
        }

        const expect = () => new Promise((resolve, reject) => {

            this.mqttClient.subscribe(toTopic, { qos: 1 }, function (err: any) {
                console.log("subcribe")
            })

            this.mqttClient.on('message', (topic: string, message: string) => {
                const output = message.toString()
                if (toTopic === topic.toString() && output.split(';')[0] === type) {
                    return resolve(output);
                }
            });
        })


        return await Promise.race([wait(), expect()]);

    }


    async receiveMessage(topicT: string, type: string) {
        const toTopic = `ToServer/${topicT.split('/')[1]}`
        const wait = () => {
            return new Promise((_, reject) => {
                setTimeout(() => {
                    this.mqttClient.unsubscribe(toTopic, function (err: any) {
                        console.log("unsubcribe")
                    });
                    reject(new Error('timeout'))
                }
                    , 5000);
            });
        }

        const expect = () => new Promise((resolve, reject) => {

            this.mqttClient.subscribe(toTopic, { qos: 1 }, function (err: any) {
                console.log("subcribe")
            })

            this.mqttClient.on('message', (topic: string, message: string) => {
                const output = message.toString()
                if (toTopic === topic.toString() && output.split(';')[0] === type) {
0
                    return resolve(output);
                }
            });
        })


        return await Promise.race([wait(), expect()]);

    }

    async sendAndExpect(message: string, topic: string) {
        try {
            const type = message.split(';')[0]
            let [someResult, anotherResult] = await Promise.all([this.expectMessage(topic, type), await this.sendMessage(message, topic)]);
            return checkResponseMessage(someResult as string)
        }

        catch (err) {
            if (typeof err === "string") {
                throw new Error(err)
            }
            else {
                throw new Error('no response')
            }        }
    }

    async sendAndReceive(message: string, topic: string) {
        try {
            const type = message.split(';')[0]
            let [someResult, anotherResult] = await Promise.all([this.expectMessage(topic, type), await this.receiveMessage(message, topic)]);
            return checkResponseMessage(someResult as string)
        }

        catch (err) {
            if (typeof err === "string") {
                throw new Error(err)
            }
            else {
                throw new Error('no response')
            }
        }
    }
}

const checkResponseMessage = (message: string):string => {
    const msg = message.split(";")
    if (!msg[2]) {
        throw "Invalid response message "
    }
    if (msg[1] === "NOK") {
        throw `Failed code : ${msg[2]}`
    }
    return message
}



export default MqttHandler;