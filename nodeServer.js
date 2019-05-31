import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import logger from "./core/logger/app-logger"
import morgan from "morgan"
import config from "./core/config/config.dev"
import { getRouter, postRouter } from "./routes/indexRouter.js"
import connectToDb from "./db/connect"

import connectRedis from "./db/redis"

const port = config.serverPort
logger.stream = {
  write: function(message, encoding) {
    logger.info(message)
  }
}

connectToDb()
connectRedis()

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan("dev", { stream: logger.stream }))

// 挂在路由 /get 是一级路由  转到 ./routes/* 中来 里面的 /* 是子路由，完整的路由 /get/*
app.use("/get", getRouter)
app.use("/post", postRouter)

//Index route
app.get("/", (req, res) => {
  res.send("对不起您访问的路径不正确，请核对访问地址！")
})

app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/chat.html');
});




app.listen(port, () => {
  logger.info("server started - ", port)
  logger.info("项目已经启动：", `http://localhost:${port}`)
})
