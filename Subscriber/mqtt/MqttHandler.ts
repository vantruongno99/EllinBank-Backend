import mqtt from 'mqtt';

class MqttHandler {
    mqttClient: any;
    a: number;
    constructor() {
        this.mqttClient = mqtt.connect("mqtt://localhost");

        this.a = 0;

        // Mqtt error calback
        this.mqttClient.on('error', (err: any) => {
            console.log(err);
            this.mqttClient.end();
        });

        // Connection callback
        this.mqttClient.on('connect', () => {
            console.log(`mqtt client connected`);
        });

        // mqtt subscriptions
        this.mqttClient.subscribe('mytopic', { qos: 0 });

        // When a message arrives, console.log it

        this.mqttClient.on('close', () => {
            console.log(`mqtt client disconnected`);
        });
    }

    // Sends a mqtt message to topic: mytopic
    async sendMessage(message: string, topic: string) {
        await this.mqttClient.publish(topic, message);
    }

    async expectMessage(messageT: string, topicT: string) {
        await this.mqttClient.subscribe(topicT, function (err: any) {
        })

        return new Promise((resolve, reject) => {
            this.mqttClient.on('message', (topic: string, message: string) => {
                if (topicT === topic.toString()) {
                    this.mqttClient.unsubscribe(topicT, function (err: any) {
                        if (err) {

                        }
                        else {
                            console.log("unscribe")
                        }
                        return resolve(JSON.parse(message.toString()));
                    });
                }
            });
        })
    }

    async close() {
        await this.mqttClient.end()
    }
}

export default MqttHandler;