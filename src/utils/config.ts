require('dotenv').config();
const { PORT } = process.env;
const JWT_SCERET = process.env.SECRET
const MQTT = process.env.MQTT || "mqtt://localhost"
const REDIS =  process.env.REDIS
const QOS = parseInt(process.env.QOS as string)


export default {
  PORT, JWT_SCERET, MQTT, REDIS ,QOS
};
