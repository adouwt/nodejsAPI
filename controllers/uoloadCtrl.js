// controller 里面导入 model ，调用model 的方法，查询数据库
// import path from 'path'
// import fs from 'fs'
const fs = require('fs')
const path = require('path')
const { createReadStream, readdirSync, createWriteStream } = require('fs');
import {deleteFolderRecursive } from '../utils/fsUtils'
/**
 * @desc 多个文件通过Stream合并为一个文件
 * 设置可读流的 end 为 false 可保持写入流一直处于打开状态，不自动关闭
 * 直到所有的可读流结束，再将可写流给关闭。
 * @param {object[]} fileList
 * @param {string} fileList.filePath 待合并的文件路径
 * @param {WriteStream} fileWriteStream 可写入文件的流
 * @returns {*}
 */
 function streamMergeRecursive(fileList, fileWriteStream) {
  if (!fileList.length) {
    console.log('-------- WriteStream 合并完成 --------');
    // 最后关闭可写流，防止内存泄漏
    // 关闭流之前立即写入最后一个额外的数据块(Stream 合并完成)。
    fileWriteStream.end();
    return;
  }
  const data = fileList.shift();
  const { filePath: chunkFilePath } = data;
  console.log('-------- 开始合并 --------\n', chunkFilePath);
  // 获取当前的可读流
  const currentReadStream = createReadStream(chunkFilePath);
  // 监听currentReadStream的on('data'),将读取到的内容调用fileWriteStream.write方法
  // end:true 读取结束时终止写入流,设置 end 为 false 写入的目标流(fileWriteStream)将会一直处于打开状态，不自动关闭
  currentReadStream.pipe(fileWriteStream, { end: false });
  // 监听可读流的 end 事件，结束之后递归合并下一个文件 或者 手动调用可写流的 end 事件
  currentReadStream.on('end', () => {
    console.log('-------- 结束合并 --------\n', chunkFilePath);
    streamMergeRecursive(fileList, fileWriteStream);
  });

  // 监听错误事件，关闭可写流，防止内存泄漏
  currentReadStream.on('error', (error) => {
    console.error('-------- WriteStream 合并失败 --------\n', error);
    fileWriteStream.close();
  });
}

/**
 * @desc 合并文件入口
 * @param {string} sourceFiles 源文件目录
 * @param {string} targetFile 目标文件
 */
function streamMergeMain(sourceFiles, targetFile) {
  // 获取源文件目录(sourceFiles)下的所有文件
  const chunkFilesDir = path.resolve(__dirname, sourceFiles);
  const list = readdirSync(chunkFilesDir);
  const fileList = list.map((name) => ({
    name,
    filePath: path.resolve(chunkFilesDir, name),
  }));

  // 创建一个可写流
  const fileWriteStream = createWriteStream(path.resolve(__dirname, targetFile));

  streamMergeRecursive(fileList, fileWriteStream);
}


let uploadCtrl = {}
uploadCtrl.uploadChunksFile = (req, res, next) => {
    console.log(req.fields)
    // console.log(req.files)
    res.send({
        ok: 'success',
        content: JSON.stringify(req.fields)
    })
}

uploadCtrl.mergeFilesChunk = async (req, res, next) => {
    console.log(req.fields)
    console.log(req.body)
    const { filename, size, fileType } = req.body;
    // 合并 chunks
    await streamMergeMain('../tmpDir/' + filename, `../tmpDir/${filename}.${fileType}`);
    // 删除临时文件流
    let tmpDir = path.resolve(__dirname, '../tmpDir/' + filename)
    // if(fs.existsSync(tmpDir)) {
    //   await deleteFolderRecursive(tmpDir);  
    // }
    // 处理响应
    res.send({
        ok: 'success',
        data: {
            code: 2000,
            filename,
            size
        },
    })
}

export default uploadCtrl;