import mqtt from 'mqtt';

class MqttHandler {
    mqttClient: any;
    constructor() {
        this.mqttClient = null;
    }

 connect() {
        // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
        this.mqttClient = mqtt.connect("mqtt://localhost");

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
        this.mqttClient.on('message', function (topic: string, message: string) {
            console.log(message.toString());
        });

        this.mqttClient.on('close', () => {
            console.log(`mqtt client disconnected`);
        });
    }

    // Sends a mqtt message to topic: mytopic
    async sendMessage(message: string ,topic : string) {
        await this.mqttClient.publish(topic, message);
    }

    async close() {
        await this.mqttClient.end()
    }
}

export default MqttHandler;