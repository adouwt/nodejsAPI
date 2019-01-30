// controller 里面导入 model ，调用model 的方法，查询数据库
import WexinUser from '../models/WexinUserModelSchema'
import logger from '../core/logger/app-logger'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const wexinUserCtrl = {};

// 获取全部用户信息
wexinUserCtrl.getAllUser = (req, res, next) => {
    WexinUser.find({})
        .then(users => {
            logger.info(`wexinUserCtrl.getAllUser${users}`)
            // todo 只筛选部分信息，不包括密码 id 等敏感信息
            res.send({
                success: true,
                message: '获取成功',
                users: users
            })
        })
        .catch(next => {
            logger.error(`wexinUserCtrl.getAllUser${next}`)
        })
}
// 获取单个信息
wexinUserCtrl.getSomeOne = (req, res, next) => {
    const id = req.body.id
    WexinUser.findById({ _id: id }).then(user => {
        res.send(user)
    }).catch(next)
}


// 微信签到
wexinUserCtrl.addOneUser = (req, res, next) => {
    const { nickName, avatarUrl } = req.body
    console.log(req.body)
    if (!nickName) {
        logger.error(`wexinUserCtrl.addSomeOne-nickName is ${nickName} --91-用户名不能为空`)
        console.log('用户名不能为空')
        res.send({
            success: false,
            message: '用户名不能为空',
        })
    }
    if (!avatarUrl) {
        logger.error(`wexinUserCtrl.addSomeOne-avatar_url is ${avatarUrl}-- 密码为空--99`)
        res.send({
            success: false,
            message: '密码为空',
        })
    }
    logger.info(`wexinUserCtrl.getSomeOne-${nickName}-${avatarUrl}`)

    WexinUser.findOne({ name: nickName }).count().then(count => {
        if (count > 0) {
            logger.info(`wexinUserCtrl.getSomeOne-`)
            res.send({
                success: false,
                message: '不能反复签到'
            })
        } else {
            const userInfo = {
                "name": nickName,
                "avatarUrl": avatarUrl
            }
            WexinUser.create(userInfo).then(user => {
                const userToken = {
                    name: user.name,
                    id: user._id
                }
                // 密钥
                const secret = 'erlinger'
                // 生成token,可以在加一个设置失效日期
                const token = jwt.sign(userToken, secret)
                logger.info(`wexinUserCtrl.getSomeOne-${new Date()}`)
                res.send({
                    success: true,
                    message: '签到成功',
                    token: token,
                })
            })
        }
    }).catch(next => {
        logger.error(`WexinUser.getSomeOne--${next}---142`)
    })
    
}


// 用户退出
wexinUserCtrl.logout = (req, res, next) => {
    const token = req.headers['w-token'];
    const decode = jwt.verify(token, 'erlinger')
    const name = decode.name
    WexinUser.findOne({ name: name })
        .then(user => {
            logger.info(`wexinUserCtrl.logout-${name}--ok`)
            res.send({
                success: true,
                data: '',
                message: '退出成功'
            })
        })
        .catch(next)

}

export default wexinUserCtrl;