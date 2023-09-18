import * as redis from 'redis';
import type { RedisClientType } from 'redis'
import config from '../utils/config'

const redisClient: RedisClientType = redis.createClient({
   url : config.REDIS,
   password : "Cti-3086"
  })

redisClient.on("error", (error: any) => console.error(`Error Redis: ${error}`));

redisClient.connect();

export default redisClient;