// controller 里面导入 model ，调用model 的方法，查询数据库
import User from '../models/UserModelSchema'
import logger from '../core/logger/app-logger'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const userCtrl = {};
// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')

// 获取全部用户信息
userCtrl.getAllUser = (req, res, next) => {
    User.find({})
    .then(users => {
        logger.info(`userCtrl.getAllUser${users}`)
        res.send(users)
    })
    .catch(next =>{
        logger.error(`userCtrl.getAllUser${next}`)
    })
}

// 获取单个信息
userCtrl.getSomeOne = (req, res, next) => {
    const id = req.params.id
    User.findById({ _id: id }).then(user => {
        res.send(user)
    }).catch(next)
}

// 获取单个用户，通过token, 和query，通过query查询其他用户
userCtrl.getOne = (req, res, next) => {
    const token = req.headers.accesstoken
    const decode = jwt.verify(token, 'erlinger')
    const name = decode.name
    User.findOne({ name: name })
    .then(user => {
        res.send(user)
    })
    .catch(next)
}

// 添加一个用户,用户登录,注册
userCtrl.getSomeOne = (req, res, next) => {
    const { username, password, type } = req.query
    if (type === 'signin') { // 登录
        User.findOne({ name: username }).then(user => {
        if (user != null) {
            if (!bcrypt.compareSync(password, user.password)) { // 如果密码错误，返回状态给前端
            res.send({
                success: false,
                message: '认证失败，密码错误'
            })
            } else { // 密码正确
            const userToken = {
                name: user.name,
                id: user._id
            }
            // 密钥
            const secret = 'erlinger'
            // 生成token,可以在加一个设置失效日期
            const token = jwt.sign(userToken, secret)
            res.send({
                success: true,
                message: '登录成功',
                token: token
            })
            }
        } else {
            res.send({
            success: false,
            message: '用户不存在'
            })
        }
        }).catch(next)
  } else if (type === 'signup') { // 注册
    User.findOne({name: username}).count().then(count => {
      if (count > 0) {
        logger.info(`userCtrl.getSomeOne-${type}`)
        res.send({
          success: false,
          message: '用户名已存在'
        })
      } else {
        // 密码加盐处理
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const userInfo = {
          name: username,
          password: hash,
          avatar_url: 'http://i1.fuimg.com/605011/1f0138a7b101b0f1.jpg'
        }
        User.create(userInfo).then(user => {
          const userToken = {
            name: user.name,
            id: user._id
          }
          // 密钥
          const secret = 'erlinger'
          // 生成token,可以在加一个设置失效日期
          const token = jwt.sign(userToken, secret)
          res.send({
            success: true,
            message: '注册成功',
            token: token
          })
        })
      }
    }).catch(next => {
        logger.error(`userCtrl.getSomeOne-${type}----${next}`)
    })
  }
}

// 修改
userCtrl.updateSomeOne = (req, res, next) => {
    const id = req.query.id
    const type = req.query.update_type
    if (type === 'username') {
        User.findByIdAndUpdate({ _id: id }, { $set: { name: req.query.username }})
        .then(user => {
            logger.info(`userCtrl.updateSomeOne-${type}--ok`)
            User.findById({_id: id}).then((user) => {
                res.send({
                    success: true,
                    message: '修改成功',
                    user: user
                })
            })
        }).catch(next)
    } else if(type === 'password'){
        User.findByIdAndUpdate({ _id: id }, { $set: { password: req.query.password }})
        .then(user => {
            logger.info(`userCtrl.updateSomeOne-${id}-${type}--ok`)
            User.findById({_id: id}).then((user) => {
                res.send({
                    success: true,
                    message: '修改成功',
                    user: user
                })
            })
        }).catch(next =>{
            logger.error(`userCtrl.updateSomeOne-${id}-${type}----${next}`)
        })
    }
}

// 删除一个用户
userCtrl.deleteSomeOne = (req, res, next) => {
  const id = req.query.id
  User.findByIdAndRemove({ _id: id }).then(() => {
    logger.info(`userCtrl.updateSomeOne-${id}--ok`)
    User.find({}).then(users =>{
        res.send({
            success: true,
            message: '删除成功',
            user: users
        })
    })
     
  })
    .catch(next =>{
        logger.error(`userCtrl.deleteSomeOne-${id}----${next}`)
    })      
}

export default userCtrl;