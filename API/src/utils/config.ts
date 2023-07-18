require('dotenv').config();
const { PORT } = process.env;
const JWT_SCERET = process.env.SECRET
const MQTT = process.env.MQTT || "mqtt://localhost"
const REDIS = process.env.NODE_ENV === "production" ? process.env.REDIS : "redis://localhost:6379"


export default {
  PORT, JWT_SCERET, MQTT, REDIS
};
