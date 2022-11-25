import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import logger from "./core/logger/app-logger"
import morgan from "morgan"
import config from "./core/config/config.dev"
import { getRouter, postRouter } from "./routes/indexRouter.js"
import connectToDb from "./db/connect"

import connectRedis from "./db/redis"
// import formidable from 'formidable' // 引入
import { readFile } from './utils/fsUtils'
const path = require('path')
const fs = require('fs')

const tmpDir = './tmpDir'
const formidable = require('formidable');

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
// app.use(formidable({
//   encoding: 'utf-8',
//   uploadDir: './tmpDir',
//   multiples: true, // req.files to be arrays of files
// }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan("dev", { stream: logger.stream }))

// 挂在路由 /get 是一级路由  转到 ./routes/* 中来 里面的 /* 是子路由，完整的路由 /get/*
app.use("/get", getRouter)
app.use("/post", postRouter)

app.post('/api/upload',  (req, res, next) => {
    // 创建表单解析对象
    const form = new formidable.IncomingForm()
    // 配置上传文件的位置
    form.uploadDir = path.join(__dirname, './tmpDir/')
    // 保留上传文件的后缀
    form.keepExtensions = true
    // 是否是多文件上传
    form.multiples = true
    // 解析表单
    form.parse(req, async (err, fields, files) => {
      if(err) {
        throw err
      }
      // fields 普通表单数据
      // files 文件上传数据
      // 新建以hash值命名的文件夹，将值放进去
      let hashFileDir = form.uploadDir  + fields.fileHash
      if(!fs.existsSync(hashFileDir)) {
        fs.mkdir(hashFileDir, (err) => {
          if(err) {
            console.log(`${hashFileDir} 创建失败` )
            throw err
          }
          //重命名上传的文件
          let _oldFileName = fields.filename + '-' + fields.hash
          let oldFilePath = JSON.parse(JSON.stringify(files))[_oldFileName].filepath;
          fs.rename(oldFilePath, hashFileDir + '/_' + fields.hash,err=>{
            if(err) {
              console.log("重命名失败");
              console.log(err);
            }else{
              console.log("重命名成功!");
            }
          })
        })
      } else {
         //重命名上传的文件
         let _oldFileName = fields.filename + '-' + fields.hash
         let oldFilePath = JSON.parse(JSON.stringify(files))[_oldFileName].filepath;
         fs.rename(oldFilePath, hashFileDir + '/_' + fields.hash,err=>{
           if(err) {
             console.log("重命名失败");
             console.log(err);
           }else{
             console.log("重命名成功!");
           }
         })
      }
      
      
      console.log(fields)
      console.log(files)
      // 写文件
      // await readFile(fields.fileHash, fields.hash, files)
      res.send({ fields, files, success: true });
    })
});


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


// 写文件
