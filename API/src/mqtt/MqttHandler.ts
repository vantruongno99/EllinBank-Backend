import mqtt from 'mqtt';
import config from '../utils/config'
class MqttHandler {
    mqttClient: any;
    constructor() {
        this.mqttClient = mqtt.connect(config.MQTT);

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
            this.mqttClient.publish(topic, message, { qos: 2, retain: true }, (err: any, result: any) => {
                if (err) reject(err)
                else resolve(result)
            })
        })
    }

    async close() {
        await this.mqttClient.end()
    }

    async expectMessage(topicT: string) {
        await this.mqttClient.subscribe(topicT, function (err: any) {
        })

        function wait() {
            return new Promise((_, reject) => {
                setTimeout(() => reject(new Error('timeout succeeded')), 500);
            });
        }

        const expect = () => new Promise((resolve, reject) => {
            this.mqttClient.on('message', (topic: string, message: string) => {


                if (topicT === topic.toString()) {
                    this.mqttClient.unsubscribe(topicT, function (err: any) {
                        if (err) {

                        }
                        else {
                            console.log("unsubcribe")
                        }
                        return resolve(JSON.parse(message.toString()));
                    });
                }
            });
        })


        return await Promise.race([wait(), expect()]);

    }
}

export default MqttHandler;