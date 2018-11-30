// controller 里面导入 model ，调用model 的方法，查询数据库
import Article from '../models/articleModelSchema'
import logger from '../core/logger/app-logger'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const articleCtrl = {};

// 获取全部用户信息
articleCtrl.getAllArticle = (req, res, next) => {
    Article.find({})
    .then(articles => {
        logger.info(`articleCtrl.getAllArticle${articles}`)
        res.send(articles)
    })
    .catch(next =>{
        logger.error(`articleCtrl.getAllArticle${next}`)
    })
}

// 获取单个信息
articleCtrl.getSomeOne = (req, res, next) => {
    const id = req.query.id
    Article.findById({ _id: id }).then(article => {
        res.send(article)
    }).catch(next)
}

// 获取单个用户，通过token, 和query，通过query查询其他用户
articleCtrl.getOne = (req, res, next) => {
    const token = req.headers.accesstoken
    const decode = jwt.verify(token, 'erlinger')
    const name = decode.name
    Article.findOne({ name: name })
    .then(article => {
        res.send(article)
    })
    .catch(next)
}

// 添加一个文章
articleCtrl.addArticle = (req, res, next) => {
    const { title, body, type } = req.query
    Article.findOne({title: title}).count().then(count => {
        if (count > 0) {
            logger.info(`articleCtrl.getSomeOne-${type}`)
            res.send({
            success: false,
            message: '文章名已经重复，请修改名称'
            })
        } else {
        const articleInfo = {
            title: title,
            body: body,
        }
        Article.create(articleInfo).then(Article => {
          res.send({
            success: true,
            message: '添加成功'
          })
        })
      }
    }).catch(next => {
        logger.error(`articleCtrl.getSomeOne-${type}----${next}`)
    })
}

// 修改
articleCtrl.updateSomeOneArticle = (req, res, next) => {
    const id = req.query.id
    const type = req.query.update_type
    if (type === 'title') {
        Article.findByIdAndUpdate({ _id: id }, { $set: { title: req.query.title }})
        .then(article => {
            logger.info(`articleCtrl.updateSomeOneArticle-${type}--ok`)
            Article.findById({_id: id}).then((article) => {
                res.send({
                    success: true,
                    message: '修改成功',
                    article: article
                })
            })
        })
        .catch(next =>{
            logger.error(`articleCtrl.deleteSomeOne-${id}----${next}`)
        }) 
    } else if(type === 'body'){
        Article.findByIdAndUpdate({ _id: id }, { $set: { body: req.query.body }})
        .then(article => {
            logger.info(`articleCtrl.updateSomeOneArticle-${id}-${type}--ok`)
            Article.findById({_id: id}).then((article) => {
                res.send({
                    success: true,
                    message: '修改成功',
                    article: article
                })
            })
        }).catch(next =>{
            logger.error(`articleCtrl.updateSomeOneArticle-${id}-${type}----${next}`)
        })
    }
}

// 删除一个用户
articleCtrl.deleteSomeOneArticle = (req, res, next) => {
  const id = req.query.id
  Article.findByIdAndRemove({ _id: id }).then(() => {
    logger.info(`articleCtrl.deleteSomeOneArticle-${id}--ok`)
    Article.find({}).then(articles =>{
        res.send({
            success: true,
            message: '删除成功',
            article: articles
        })
    })
     
  })
    .catch(next =>{
            logger.error(`articleCtrl.deleteSomeOneArticle-${id}----${next}`)
    })      
}

export default articleCtrl;