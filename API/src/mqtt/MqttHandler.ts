import mqtt from 'mqtt';

class MqttHandler {
    mqttClient: any;
    constructor() {
        this.mqttClient = mqtt.connect("mqtt://test.mosquitto.org");

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
}

export default MqttHandler;