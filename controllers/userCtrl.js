// controller 里面导入 model ，调用model 的方法，查询数据库
import User from '../models/UserModelSchema'
import Rate from '../models/RateModelSchema'
import logger from '../core/logger/app-logger'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import clientRedis from "../db/redis"
import { countRate } from  '../utils/normalUtils'
const userCtrl = {};

// 获取全部用户信息
userCtrl.getAllUser = (req, res, next) => {
    User.find({})
        .sort({'_id': -1})
        .then(users => {
            logger.info(`userCtrl.get${11}`)
            // todo 只筛选部分信息，不包括密码 id 等敏感信息
            res.send({
                success: true,
                message: '获取成功',
                users: users
            })
        })
        .catch(next => {
            logger.error(`userCtrl.getAllUser${next}`)
        })
}

// 分页获取全部用户信息
userCtrl.getAllUserFromPage = async (req, res, next) => {
    let { page, skip } = req.body
    let dataNumber = parseInt(page) * 5 || 5
    let maxSize = 1
    let allDataLength = 1
    await User.find({}).then(user => {
        maxSize = Math.ceil(user.length / 5)
        allDataLength = user.length
    })
    if(!skip) {
        await User.find({})
            .limit(dataNumber)
            .sort({'_id': -1})
            .then(users => {
                logger.info(`getAllUserFromPage.get${11}`)
                // todo 只筛选部分信息，不包括密码 id 等敏感信息
                if(page>=maxSize) {
                    page = maxSize
                }
                res.send({
                    success: true,
                    message: '获取成功',
                    users: users,
                    currentPageSize: page++,
                    maxSize: maxSize,
                    allDataLength: allDataLength
                })
            })
            .catch(next => {
                logger.error(`getAllUserFromPage.getAllUser${next}`)
            })
    } else {
        await User.find({})
            .skip(dataNumber - 5)
            .limit(5)
            .sort({'_id': -1})
            .then(users => {
                logger.info(`getAllUserFromPage.get${11}`)
                // todo 只筛选部分信息，不包括密码 id 等敏感信息
                if(page>=maxSize) {
                    page = maxSize
                }
                res.send({
                    success: true,
                    message: '获取成功',
                    users: users,
                    currentPageSize: page++,
                    maxSize: maxSize,
                    allDataLength: allDataLength
                })
            })
            .catch(next => {
                logger.error(`getAllUserFromPage.getAllUser${next}`)
            })
    }
    
}


// 获取单个信息
userCtrl.getOneUser = (req, res, next) => {
    const id = req.body.id
    // console.log(id)
    User.findById({ _id: id }).then(user => {
        // console.log('user-----------------------------------', user)
        res.send({
            success: true,
            data: {
                "userMsg": {
                    '_id': user._id,
                    'name': user.name,
                    'uri': user.avatar_url
                }
            }
        })
    }).catch(next)
}

// 获取单个用户，通过token, 和query，通过query查询其他用户
userCtrl.getOne = (req, res, next) => {
    // console.log(req.headers, 'req --31')
    const token = req.headers['w-token'];
    jwt.verify(token, 'erlinger', (err, decode) => {
        if(err) {
            console.log('err', err);
            res.send({
                success: false,
                data: {
                    "expired": true
                }
            })
            return
        }
        const name = decode.name
        // todo 需要将users信息过滤下
        User.findOne({ name: name })
            .then(user => {
                res.send({
                    success: true,
                    data: user
                })
            })
            .catch(err => {
                console.log(err)
                next()
        })
    })
    
}

// 用户登录
userCtrl.getSomeOne = (req, res, next) => {
    const { username, password, type } = req.body || req.query
    if (1) {
        // if (type === 'signin') {
        User.findOne({ name: username }).then(user => {
            if (user != null) {
                if (!bcrypt.compareSync(password, user.password)) { // 如果密码错误，返回状态给前端
                    logger.info(`【${new Date().toLocaleString()}】-userCtrl.getSomeOne--53`)
                    res.send({
                        success: false,
                        message: '认证失败，密码错误'
                    })
                } else { // 密码正确
                    const userToken = {
                        name: user.name,
                        id: user._id,
                        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 12) // 过期时间为12个小时
                    }
                    // 密钥
                    const secret = 'erlinger'
                    // 生成token,可以在加一个设置失效日期
                    const token = jwt.sign(userToken, secret)
                    logger.info(`【${new Date().toLocaleString()}】-userCtrl.getSomeOne-登录成功--67`)
                    res.send({
                        success: true,
                        message: '登录成功',
                        token: token,
                        user: user
                    })
                    // res.send(user)
                }
            } else {
                logger.info(`【${new Date().toLocaleString()}】-userCtrl.getSomeOne-用户不存在 --75`)
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
    const { username, password, type, roles , registerCode } = req.body
    
    // 遗留的问题： 要生成一个以时间戳命名的 redis 的key， 不然这个key 的value 会被覆盖，、
    //        这个时间戳如何保存并被获取到？
    // // async 处理异步
    // clientRedis.get("registerCode", (err, res) =>{
    //     console.log(res); // code
    //     if (res !== registerCode) {
    //         logger.error(`userCtrl.registerCode is --118-验证码不正确！`)
    //         res.send({
    //             success: false,
    //             message: '验证码不正确',
    //         })
    //     }
    // })


    // 从这个例子上虽说代码量上多了点，但是 还是好 🐶
    const codeAsync = () =>{
        return new Promise(resolve => {
            clientRedis.get("registerCode", (err, res) =>{
                console.log(res); // code
                resolve(res)
            })
        })
    }
    let getRegisterCode = async () => {
        let code = await codeAsync();
        if (code !== registerCode) {
            logger.error(`userCtrl.registerCode is --124行-验证码不正确！`)
            res.send({
                success: false,
                message: '验证码不正确',
            })
        }
        return
    }
    getRegisterCode()

    if (!username) {
        logger.error(`userCtrl.addSomeOne-username is ${username} --91-用户名不能为空`)
        console.log('用户名不能为空')
        res.send({
            success: false,
            message: '用户名不能为空',
        })
    }
    if (!password) {
        logger.error(`userCtrl.addSomeOne-password is ${password}-- 密码为空--99`)
        res.send({
            success: false,
            message: '密码为空',
        })
    }

    console.log(roles, 'roles---------------------')
    logger.info(`userCtrl.registerCode-${registerCode}-=-=-=$`)

    if (type === 'signup') { // 注册
        User.findOne({ name: username }).count().then(count => {
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
                    avatar_url: 'http://pic16.nipic.com/20110821/2619077_142423513144_2.jpg',
                    roles: roles,
                    regsiterTime: (new Date()).toLocaleString()
                }
                // console.log((new Date()).toLocaleString(), '11111111111111111111111111111111111')
                User.create(userInfo).then(user => {
                    const userToken = {
                        name: user.name,
                        id: user._id
                    }
                    // 密钥
                    const secret = 'erlinger'
                    const token = jwt.sign(userToken, secret)
                    res.send({
                        success: true,
                        message: '注册成功',
                        token: token,
                        roles: roles,
                        regsiterTime: (new Date()).toLocaleString()
                    })
                })
            }
        }).catch(next => {
            logger.error(`userCtrl.getSomeOne-${type}----${next}--142`)
        })
    } else {
        res.send({
            success: false,
            message: `注册失败,type is ${type}`
        })
        logger.error(`userCtrl.addSomeOne-${type}`)
    }
}

// 管理员添加用户
userCtrl.adminAddSomeOne = (req, res, next) => {
    const { username, password, roles, age } = req.body 

    if (!username) {
        logger.error(`userCtrl.addSomeOne-username is ${username} --91-用户名不能为空`)
        console.log('用户名不能为空')
        res.send({
            success: false,
            message: '用户名不能为空',
        })
    }
    if (!password) {
        logger.error(`userCtrl.addSomeOne-password is ${password}-- 密码为空--99`)
        res.send({
            success: false,
            message: '密码为空',
        })
    }

    console.log(roles, 'roles---------------------')

    User.findOne({ name: username }).count().then(count => {
        if (count > 0) {
            logger.info(`userCtrl.getSomeOne`)
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
                avatar_url: 'http://pic16.nipic.com/20110821/2619077_142423513144_2.jpg',
                roles: roles,
                regsiterTime: (new Date()).toLocaleString(),
                age: age
            }
            // console.log((new Date()).toLocaleString(), '11111111111111111111111111111111111')
            User.create(userInfo).then(user => {
                const userToken = {
                    name: user.name,
                    id: user._id
                }
                // 密钥
                const secret = 'erlinger'
                const token = jwt.sign(userToken, secret)
                res.send({
                    success: true,
                    message: '注册成功',
                    token: token,
                    roles: roles,
                    regsiterTime: (new Date()).toLocaleString()
                })
            })
        }
    }).catch(next => {
        res.send({
            success: false,
            message: `添加用户失败`
        })
        logger.error(`userCtrl.getSomeOne-----${next}--142`)
    })
}

// 用户修改昵称和密码
userCtrl.updateSomeOne = (req, res, next) => {
    const { username, id, updateType, password } = req.body
    if (!username) {
        res.send({
            success: false,
            message: '用户名不能为空',
        })
        logger.error(`userCtrl.addSomeOne-username is ${username}`)
        return
    }
    if (!password) {
        res.send({
            success: false,
            message: '密码为空',
        })
        logger.error(`userCtrl.addSomeOne-password is ${password}`)
        return
    }
    if (!updateType) {
        res.send({
            success: false,
            message: '类型为空',
        })
        logger.error(`userCtrl.addSomeOne-password is ${updateType}`)
        return
    }
    User.findById({ _id: id }).then(user => {
        if (user) {
            if (updateType === 'username') {
                User.findByIdAndUpdate({ _id: id }, { $set: { name: username } })
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
                User.findByIdAndUpdate({ _id: id }, { $set: { password: password } })
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
    const id = req.body.id
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

// 修改用户角色
userCtrl.updateSomeOneRole = (req, res, next) => {
    const { id, roles } = req.body
    if (!id) {
        res.send({
            success: false,
            message: '未找到指定删除目标'
        })
    }
    // TODO 用async 替换 先查id 在删id 的异步操作
    User.findById({ _id: id }).then(user => {
        if (user) {
            User.findByIdAndUpdate({ _id: id }, { $set: { roles: roles } })
                .then(user => {
                    logger.info(`userCtrl.updateSomeOneRole-${id}-${roles}--ok`)
                    User.findById({ _id: id }).then((user) => {
                        res.send({
                            success: true,
                            message: '修改成功',
                            user: user
                        })
                    })
                }).catch(next => {
                    logger.error(`userCtrl.updateSomeOne-${id}----${next}`)
                })
        } else {
            res.send({
                success: false,
                message: '未找到指定修改目标'
            })
        }
    }).catch(next)
}

// 修改用户rate
userCtrl.updateSomeOneRate = (req, res, next) => {
    const { id, rate } = req.body
    if (!id) {
        res.send({
            success: false,
            message: '未找到指定目标'
        })
    }
    User.findById({ _id: id }).then(user => {
        if (user) {
            const userInfo = {
                userId: id,
            }
            // 先查找 userId 的表是否存在
            // 是 update
            Rate.findOne({
                userId: id
            }).count().then((count) => {
                if(count > 0) {
                    Rate.update({ userId: id }, {
                        $push: {
                            "rateList": {
                                rateTime: (new Date()).toLocaleString(),
                                rate: rate
                            }
                        },
                    }).then((rateItem) => {
                        res.send({
                            success: true,
                            message: '评分成功'
                        })
                    }).catch(next => {
                        logger.error(`userCtrl.updateSomeOneRate-${id}----${next}`)
                    })
                } else {
                    // 否 insert 表数据
                    Rate.create(userInfo).then(user => {
                        console.log(user, 'rate-user')
                        Rate.update({ userId: id }, {
                            $push: {
                                "rateList": {
                                    rateTime: (new Date()).toLocaleString(),
                                    rate: rate
                                }
                            },
                        }).then((rateItem) => {
                            res.send({
                                success: true,
                                message: '评分成功'
                            })
                        })
                    }).catch(next => {
                            logger.error(`userCtrl.updateSomeOne-${id}----${next}`)
                    })
                }
            })
            
        } else {
            res.send({
                success: false,
                message: '未找到指定修改目标'
            })
        }
    }).catch(next)
}

// 获取全部用户(计算rates 标准关联的 rate信息)
userCtrl.getAllUserAndRateCount = (req, res, next) => {
    User.find({})
        .sort({'_id': -1})
        .then( async (users) => {
            logger.info(`userCtrl.getAllUserAndRateCount${11}`);
            let rateArr = []
            for(let i = 0; i < users.length; i++) {
                await Rate.findOne({userId: users[i]._id}).then((rateUser) => {
                    rateArr.push({
                        _id: users[i]._id,
                        name: users[i].name,
                        avatar_url: users[i].avatar_url,
                        regsiterTime: users[i].regsiterTime,
                        price: users[i].price,
                        user_desc: users[i].user_desc,
                        rate: rateUser.rateList
                    })
                })
            }
            let newUserList = [...rateArr];
            let userListTmp = []
            let rateCount = 0;
            for(let j = 0; j < newUserList.length; j++) {
                for(let k = 0; k < newUserList[j].rate.length; k++) {
                    rateCount += newUserList[j].rate[k].rate
                }
                userListTmp.push({...newUserList[j], rate: countRate((rateCount/ newUserList[j].rate.length).toFixed(2))})
            }
            res.send({
                success: true,
                message: '获取成功',
                // users: [...rateArr],
                users : userListTmp
            })
        })
        .catch(next => {
            logger.error(`userCtrl.getAllUser${next}`)
        })
}

// 用户退出
userCtrl.logout = (req, res, next) => {
    const token = req.headers['w-token'];
    const decode = jwt.verify(token, 'erlinger')
    const name = decode.name
    User.findOne({ name: name })
        .then(user => {
            logger.info(`userCtrl.logout-${name}--ok`)
            res.send({
                success: true,
                data: '',
                message: '退出成功'
            })
        })
        .catch(next)

}
export default userCtrl;