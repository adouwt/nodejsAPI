// controller 里面导入 model ，调用model 的方法，查询数据库
import logger from "../core/logger/app-logger"
import email from "../utils/nodemail"
import { randomStrFour } from '../utils/radomStrFour'
import clientRedis from "../utils/redis"


const emailServiceCtrl = {}
// 发动code 到邮箱 && 保存code 在Redis
emailServiceCtrl.resgisterCode = (req, res, next) => {
	// let email = req.body.email;
	let code = randomStrFour();
	let mail = "1259709654@qq.com";

	clientRedis.set("registerCode", code, () =>{
		// console.log('redis 存储成功');
		email.send(mail, code, state => {
			if (state === 1) {
				logger.info(`redis code-${code}`)
				res.status(200).send("发送成功")
			} else {
				logger.error(`redis code-${code}`)
				res.status(200).send("发送失败")
			}
		})
	});

	clientRedis.expire('registerCode', 5*60);

	
}

export default emailServiceCtrl
