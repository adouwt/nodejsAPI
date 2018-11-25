import express from "express";
import userCtrl from "../controllers/userCtrl.js"
import artilceCtrl from "../controllers/articleCtrl.js"
const postRouter = express.Router()

// 注册
postRouter.post('/register', (req, res) => {
    // console.log('-----router', req.query)
    userCtrl.getSomeOne(req, res);
});
// 登陆
postRouter.post('/login', (req, res) => {
    // console.log('-----router', req.query)
    userCtrl.getSomeOne(req, res);
});
// 删除用户
postRouter.post('/deleteuser', (req, res) => {
    // console.log('-----router', req.query)
    userCtrl.deleteSomeOne(req, res);
});
// 修改用户
postRouter.post('/updateoneuser', (req, res) => {
    // console.log('-----router', req.query)
    userCtrl.updateSomeOne(req, res);
});

// 文章
postRouter.post('/addonearticle', (req, res) => {
    artilceCtrl.addArticle(req, res);
});
postRouter.post('/updateonearticle', (req, res) => {
    artilceCtrl.updateSomeOneArticle(req, res);
});
postRouter.post('/deleteonearticle', (req, res) => {
    artilceCtrl.deleteSomeOneArticle(req, res);
});


export default postRouter;