const fs = require('fs')
const path = require('path')
const tmpDir = '../tmpDir'
export const readFile =  (_path, fileName, data) => {
    // 先创建文件夹
    let dirPath = path.resolve(__dirname, tmpDir + '/' + _path)
    if(fs.existsSync(dirPath)) {
        let newPath =  path.resolve(__dirname, tmpDir + '/' + _path + '/' + fileName)
        let writerStream = fs.createWriteStream(newPath)
        writerStream.write(data);
        // 标记文件末尾
        writerStream.end();
        // 处理流事件 --> finish、error
        writerStream.on('finish', function() {
            console.log("写入完成。");
        });

        writerStream.on('error', function(err){
        console.log(err.stack);
        });

    }  else {
        fs.mkdir(dirPath, () => {
            let newPath =  path.resolve(__dirname, tmpDir + '/' + _path + '/' + fileName)
            let writerStream = fs.createWriteStream(newPath)
            writerStream.write(data);
            // 标记文件末尾
            writerStream.end();
            // 处理流事件 --> finish、error
            writerStream.on('finish', function() {
                console.log("写入完成。");
            });

            writerStream.on('error', function(err){
            console.log(err.stack);
            });
        })
    }
}


/**
     *
     * @param {*} url
     */
 export const  deleteFolderRecursive = (url) => {
    var files = [];
    /**
     * 判断给定的路径是否存在
     */
    if (fs.existsSync(url)) {
        /**
         * 返回文件和子目录的数组
         */
        files = fs.readdirSync(url);
        files.forEach(function (file, index) {

            var curPath = path.join(url, file);
            /**
             * fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
             */
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);

            } else {
                fs.unlinkSync(curPath);
            }
        });
        /**
         * 清除文件夹
         */
        fs.rmdirSync(url);
    } else {
        console.log("给定的路径不存在，请给出正确的路径");
    }
}