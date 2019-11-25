//读取数据库文件模块
const fs = require('fs')
const path = require('path')

let dbPath = path.join(__dirname, 'data.json')
module.exports = {
    readFile(callback) {
        fs.readFile(dbPath, (err, data) => {
            if (err) return console.log('数据库文件读取失败')
            callback && callback(data)
        })
    },
    writeFile(data, callback) {
        fs.writeFile(dbPath, JSON.stringify(data, null, 2), err => {
            if (err) return console.log('数据库文件写入失败')
            callback && callback()
        })
    }
}