import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import logger from './core/logger/app-logger'
import morgan from 'morgan'
import config from './core/config/config.dev'
import { getRouter, postRouter} from './routes/indexRouter.js'
import connectToDb from './db/connect'

const port = config.serverPort;
logger.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

connectToDb();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev", { "stream": logger.stream }));

// 挂在路由 /get 是一级路由  转到 ./routes/* 中来 里面的 /* 是子路由，完整的路由 /get/*
app.use('/get', getRouter);
app.use('/post', postRouter);

//Index route
app.get('/', (req, res) => {
    res.send('this is a index');
});

app.listen(port, () => {
    logger.info('server started - ', port);
});