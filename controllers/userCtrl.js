// controller 里面导入 model ，调用model 的方法，查询数据库
import User from '../models/UserModelSchema'
import logger from '../core/logger/app-logger'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const userCtrl = {};

// 获取全部用户信息
userCtrl.getAllUser = (req, res, next) => {
    User.find({})
        .then(users => {
            logger.info(`userCtrl.getAllUser${users}`)
            // todo 只筛选部分信息，不包括密码 id 等敏感信息
            res.send(users)
        })
        .catch(next => {
            logger.error(`userCtrl.getAllUser${next}`)
        })
}
// 获取单个信息
userCtrl.getSomeOne = (req, res, next) => {
    const id = req.query.id
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

// 用户登录
userCtrl.getSomeOne = (req, res, next) => {
    const { userName, userPassword, type } = req.query
    if (type === 'signin') {
        User.findOne({ name: userName }).then(user => {
            if (user != null) {
                if (!bcrypt.compareSync(userPassword, user.password)) { // 如果密码错误，返回状态给前端
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
    }
}

// 注册
userCtrl.addSomeOne = (req, res, next) => {
    const { userName, userPassword, type } = req.query
    if (!userName) {
        res.send({
            success: false,
            message: '用户名不能为空',
        })
        logger.error(`userCtrl.addSomeOne-userName is ${userName}`)
        return
    }
    if (!userPassword) {
        res.send({
            success: false,
            message: '密码为空',
        })
        logger.error(`userCtrl.addSomeOne-userPassword is ${userPassword}`)
        return
    }

    logger.info(`userCtrl.getSomeOne-${userName}-${userPassword}`)

    if (type === 'signup') { // 注册
        User.findOne({ name: userName }).count().then(count => {
            if (count > 0) {
                logger.info(`userCtrl.getSomeOne-${type}`)
                res.send({
                    success: false,
                    message: '用户名已存在'
                })
            } else {
                // 密码加盐处理
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(userPassword, salt)
                const userInfo = {
                    name: userName,
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
    } else {
        res.send({
            success: false,
            message: `注册失败,type is ${type}`
        })
        logger.error(`userCtrl.addSomeOne-${type}`)
    }
}

// 修改
userCtrl.updateSomeOne = (req, res, next) => {
    const { userName, id, updateType, userPassword } = req.query
    if (!userName) {
        res.send({
            success: false,
            message: '用户名不能为空',
        })
        logger.error(`userCtrl.addSomeOne-userName is ${userName}`)
        return
    }
    if (!userPassword) {
        res.send({
            success: false,
            message: '密码为空',
        })
        logger.error(`userCtrl.addSomeOne-userPassword is ${userPassword}`)
        return
    }
    if (!updateType) {
        res.send({
            success: false,
            message: '类型为空',
        })
        logger.error(`userCtrl.addSomeOne-userPassword is ${updateType}`)
        return
    }
    User.findById({ _id: id }).then(user => {
        if (user) {
            if (updateType === 'userName') {
                User.findByIdAndUpdate({ _id: id }, { $set: { name: userName } })
                    .then(user => {
                        logger.info(`userCtrl.updateSomeOne-${updateType}--ok`)
                        User.findById({ _id: id }).then((user) => {
                            res.send({
                                success: true,
                                message: '修改成功',
                                user: user
                            })
                        })
                    }).catch(next)
            } else if (updateType === 'password') {
                // todo 验证原来密码
                User.findByIdAndUpdate({ _id: id }, { $set: { password: userPassword } })
                    .then(user => {
                        logger.info(`userCtrl.updateSomeOne-${id}-${updateType}--ok`)
                        User.findById({ _id: id }).then((user) => {
                            res.send({
                                success: true,
                                message: '修改成功',
                                user: user
                            })
                        })
                    }).catch(next => {
                        logger.error(`userCtrl.updateSomeOne-${id}-${updateType}----${next}`)
                    })
            } else {
                res.send({
                    success: false,
                    message: '修改失败，未传入指定的类型'
                })
            }
        }
    }).catch(next)
    // ---------------------------------

}

// 删除一个用户
userCtrl.deleteSomeOne = (req, res, next) => {
    const id = req.query.id
    console.log(id)
    if (!id) {
        res.send({
            success: false,
            message: '未找到指定删除目标'
        })
    }
    // TODO 用async 替换 先查id 在删id 的异步操作
    User.findById({ _id: id }).then(user => {
        if (user) {
            User.findByIdAndRemove({ _id: id }).then((user) => {
                logger.info(`userCtrl.updateSomeOne-${id}--ok`)
                User.find({}).then(users => {
                    res.send({
                        success: true,
                        message: '删除成功',
                        user: users
                    })
                })
            }).catch(next => {
                logger.error(`userCtrl.deleteSomeOne-${id}----${next}`)
            })
        } else {
            res.send({
                success: false,
                message: '未找到指定删除目标'
            })
        }
    }).catch(next)

}

export default userCtrl;