# express-es6-starter

Starter project for creating a MVC express server, using

+ express
+ mongoose
+ babel-cli
+ winston and morgan for logging
+ Async/Await

## Installation

Clone the repository and run `npm install`

```
git clone https://github.com/adouwt/es6-loves.git
npm install
```

## Starting the server

```
npm start
```
## Starting the dataBase

```
npm run startdb
```
The server will run on port 3000. You can change this by editing `config.dev.js` file.

## Run server in production with pm2

```
1.npm run build
2.package.json 放进dist,上传到服务器
3.npm install
4.pm2 start serve.js
```
### package.json 放进上面

## Debugging with Webstorm

Set babel-node executable as the node interpreter.
Pass node parameters of --preset=babel-preset-es2015


## Todo
### 部署方式过于麻烦，需简化操作，一键完成
### 如果需要一个接口演示 就在这里快速写一个演示接口
