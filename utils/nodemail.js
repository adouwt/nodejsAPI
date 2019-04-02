// const nodemailer = require('nodemailer');
import nodemailer from 'nodemailer'

let transporter = nodemailer.createTransport({
    service: '163', // 运营商  qq邮箱 网易//
    port: 465,//该端口不行的情况下，将端口号改为587
    secureConnection: true,
    auth: {
        user:'wtodd202@163.com', //用哪个邮箱进行发送就输入哪个邮箱号
        pass: 'wangyi123' // pop3 授权码
    }
});
let mail={
    transporter:transporter,
    send(mail,content,callback){
        let mailOptions = {
            from: '"Vue Admin System" <wtodd202@163.com>',
            to: mail, //接收方邮箱
            subject: '欢迎注册 ', // 邮箱标题内容，可更改
            text: `${content}`, //发送的具体内容
            html: `<div style="text-indent: 2em;">欢迎注册Vue Admin System，您的注册码为：<span style="color:red;">${content}</span>，有效期为5分钟</div>` // html body
        };

        //发送
        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error, 'error')
                callback(-1);// 失败
            } else {
                console.log('Message sent: %s', info.messageId);
                callback(1);//成功
            }
        });
    }
}
module.exports=mail //再将该模块暴露出去
