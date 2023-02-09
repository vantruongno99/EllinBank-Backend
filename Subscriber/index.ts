import { PrismaClient } from '@prisma/client'
import mqtt from 'mqtt'

const prisma = new PrismaClient()
var client = mqtt.connect("mqtt://localhost")



async function main(data:any) {
    const sensor = await prisma.timeStamp.create({
        data: {
            ...data
        },
    })
    console.log(sensor)

    const getSensor = await prisma.sensor.findUnique({
        where: {
            Code:'gaptlf',
        },
        include: {
          TimeStamp: true,
        },
      })
    console.log(getSensor)
}

function messsageReceived(topic: string, message: any, packet: string) {
    try {
        let text = message.toString();
        main(JSON.parse(text))
    }
    catch (err: any) {
        console.log(err)
    }
};

client.on("connect", function () {
    console.log("connected");
})

client.on('message', messsageReceived);


client.subscribe('mqtt/test');

var timer_id = setInterval( () => { 
    const obj ={
        SensorCode : 'gaptlf',
        TimeStamp : new Date(),
        Utc : Math.floor(Date.now() / 1000),
        SensorData : JSON.stringify({Name:'test'})
    }
    publish('mqtt/test', JSON.stringify(obj)); 
}, 5000);

//publish function
const publish = (topic: string, msg: string) => {
    console.log("publishing", msg);
    if (client.connected == true) {
        client.publish(topic, msg);
    }
}
