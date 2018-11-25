import express from "express";
import userCtrl from "../controllers/userCtrl.js"
import artilceCtrl from "../controllers/articleCtrl.js"
const getRouter = express.Router()

getRouter.get('/oneuser', (req, res) => {
    userCtrl.getOneUser(req, res);
});

getRouter.get('/onearticle', (req, res) => {
    artilceCtrl.getOneArticle(req, res);
});

export default getRouter;