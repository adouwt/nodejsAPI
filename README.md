# express-es6 api

Starter project for creating a MVC express server, using

+ express
+ mongoose
+ babel-cli
+ winston and morgan for logging
+ Async/Await

## Installation

Clone the repository and run `npm install`

```
git clone https://github.com/adouwt/nodejsAPI.git
npm install
```

## Starting the server

```
npm start
```
## Starting the dataBase

```
npm run startdb (如果没有对应文件，新建一个存放数据的文件)
```
The server will run on port 4000. You can change this by editing `core/config/config.dev.js` file.

## Run server in production with pm2

```
1.npm run build
2.将项目中dist 文件,上传到服务器
3.npm install
4.pm2 start serve.js
```
##### or
```
1、sh build.sh
2、解压dist.zip npm install
3、pm2 start serve.js
```

## Todo
### 部署方式过于麻烦，需简化操作，一键完成
### 如果需要一个接口演示 就在这里快速写一个演示接口
### 图片上传，头像裁剪
