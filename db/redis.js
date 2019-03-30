import redis from "redis"
import logger from "../core/logger/app-logger"

let RDS_PORT = 6379, //端口号
    RDS_HOST = "127.0.0.1", //服务器IP
    RDS_OPTS = {}, //设置项
    client = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS)

const redisClient =  () => {
    client.on("error",  (err) => {
      logger.error("redis client连接失败",err);
    });

    client.on("ready", function(err) {
      logger.info("redis is ready")
    })
}

redisClient.set = (key, val, callback) => {
  client.set(key, val, callback)
}

redisClient.get = (key, callback) => {
  client.get(key, callback)
}

redisClient.expire = (key, time, callback) => {
  client.expire(key, time, callback)
}

// 可继续添加相关的API

export default redisClient
