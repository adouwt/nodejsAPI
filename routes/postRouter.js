import express from "express"
import userCtrl from "../controllers/userCtrl.js"
import artilceCtrl from "../controllers/articleCtrl.js"
import wexinUserCtrl from "../controllers/wexinUserCtrl.js"
import chatRoomCtrl from "../controllers/chatRoomCtrl"
import chatRoomSingleCtrl from "../controllers/chatRoomSingle"

import emailServiceCtrl from "../controllers/emailServiceCtrl.js"
const postRouter = express.Router()

// 注册
postRouter.post("/register", (req, res) => {
  // console.log('-----router', req.query)
  userCtrl.addSomeOne(req, res)
})
// 管理员添加用户
postRouter.post("/adminRegister", (req, res) => {
  // console.log('-----router', req.query)
  userCtrl.adminAddSomeOne(req, res)
})
// 登陆
postRouter.post("/login", (req, res) => {
  // console.log('-----router', req.query)
  userCtrl.getSomeOne(req, res)
})

// 获取单个用户信息
postRouter.post("/oneUser", (req, res) => {
  // console.log('-----router', req.query)
  userCtrl.getOneUser(req, res)
})

// 删除用户
postRouter.post("/deleteuser", (req, res) => {
  // console.log('-----router', req.query)
  userCtrl.deleteSomeOne(req, res)
})
// 修改用户密码昵称
postRouter.post("/updateoneuser", (req, res) => {
  // console.log('-----router', req.query)
  userCtrl.updateSomeOne(req, res)
})

// 修改用户角色
postRouter.post("/updatesomerole", (req, res) => {
  // console.log('-----router', req.query)
  userCtrl.updateSomeOneRole(req, res)
})

// 推出登录
postRouter.post("/logout", (req, res) => {
  // console.log('-----router', req.query)
  userCtrl.logout(req, res)
})
// ----------------------------------------------------------
// 文章增加
postRouter.post("/addonearticle", (req, res) => {
  artilceCtrl.addArticle(req, res)
})
// 文章修改
postRouter.post("/updateonearticle", (req, res) => {
  artilceCtrl.updateSomeOneArticle(req, res)
})
// 文章删除
postRouter.post("/deleteonearticle", (req, res) => {
  artilceCtrl.deleteSomeOneArticle(req, res)
})

// 微信签到
postRouter.post("/wexinSignIn", (req, res) => {
  wexinUserCtrl.addOneUser(req, res)
})

// 微信签到初始化
postRouter.post("/wexinSignInInit", (req, res) => {
  wexinUserCtrl.dataInit(req, res)
})

// 发送邮件
postRouter.post("/sendEmailCode", (req, res) => {
  emailServiceCtrl.resgisterCode(req, res)
})

// 分页获取用户数
postRouter.post("/getUsersFromPage", (req, res) => {
  userCtrl.getAllUserFromPage(req, res)
})

// 公共聊天室信息
postRouter.post("/getRoomAllMsg", (req, res) => {
  chatRoomCtrl.getRoomAllMsg(req, res)
})
// 保存公共聊天内容
postRouter.post("/saveChatRoomMsg", (req, res) => {
  chatRoomCtrl.saveChatRoomMsg(req, res)
})

// 生成公共聊天室
postRouter.post("/generateCommomRoom", (req, res) => {
  chatRoomCtrl.generateCommomRoom(req, res)
})

// 获取1-1聊天室 内容
postRouter.post("/getSingleRoomMsg", (req, res) => {
  chatRoomSingleCtrl.getSingleRoomMsg(req, res)
})

// 获取1-1聊天室的房间ID

postRouter.post("/getSingleRoomId", (req, res) => {
  chatRoomSingleCtrl.getRoomId(req, res);
})
// 保存单个聊天内容
postRouter.post("/saveChatRoomSingleMsg", (req, res) => {
  chatRoomSingleCtrl.saveChatRoomSingleMsg(req, res)
})

export default postRouter
