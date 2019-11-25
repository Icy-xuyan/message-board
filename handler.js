const fs = require('fs')
const path = require('path')
const mime = require('mime')
const URL = require('url')
const template = require('art-template')
const moment = require('moment')
const querystring = require('querystring')

let dbPath = path.join(__dirname, 'data.json')

module.exports = {
    renderIndex(req, res) {
        let filePath = path.join(__dirname, 'views', 'index.html')
        fs.readFile(dbPath, (err, data) => {
            if (err) return console.log('数据库文件读取失败')
            let html = template(filePath, JSON.parse(data))
            res.end(html)
        })
    },
    renderAdd(req, res) {
        let filePath = path.join(__dirname, 'views', 'add.html')
        fs.readFile(filePath, (err, data) => {
            if (err) throw err
            res.end(data)
        })
    },
    handlerDelete(req, res) {
        /**
         * 获取地址栏id
         * 读取data.json文件 删除对应id数据
         * 更新data.json文件 
         * 重定向首页
         */
        let id = URL.parse(req.url, true).query.id
        fs.readFile(dbPath, (err, data) => {
            if (err) return console.log('数据库文件读取失败')
            data = JSON.parse(data)
            data.list = data.list.filter(item => item.id !== +id)
            fs.writeFile(dbPath, JSON.stringify(data, null, 2), err => {
                if (err) return console.log('数据库文件写入失败')
                res.writeHead(302, {
                    'Location': '/'
                })
                res.end()
            })
        })
    },
    handlerGetAdd(req, res) {
        /**
         * 获取要添加的参数值
         * 读取data.json文件 添加数据
         * 更新data.json文件
         * 重定向至首页
         */
        let query = URL.parse(req.url, true).query
        let add = {
            ...query,
            id: +new Date,
            time: moment().format('YYYY年MM月DD日 HH:mm:ss')
        }
        fs.readFile(dbPath, (err, data) => {
            if (err) return console.log('数据库文件读取失败')
            data = JSON.parse(data)
            data.list.unshift(add)
            fs.writeFile(dbPath, JSON.stringify(data, null, 2), err => {
                if (err) return console.log('数据库文件写入失败')
                res.writeHead(302, {
                    'Location': '/'
                })
                res.end()
            })
        })
    },
    handlerPostAdd(req, res) {
        /**
         * 获取要添加的参数值
         * 读取data.json文件 添加数据
         * 更新data.json文件
         * 重定向至首页
         */
        let result = ''
        req.on('data', chunk => {
            result += chunk
        })
        req.on('end', () => {
            console.log(result);
            let query = querystring.parse(result)
            let add = {
                ...query,
                id: +new Date,
                time: moment().format('YYYY年MM月DD日 HH:mm:ss')
            }
            fs.readFile(dbPath, (err, data) => {
                if (err) return console.log('数据库文件读取失败')
                data = JSON.parse(data)
                data.list.unshift(add)
                fs.writeFile(dbPath, JSON.stringify(data, null, 2), err => {
                    if (err) return console.log('数据库文件写入失败')
                    res.writeHead(302, {
                        'Location': '/'
                    })
                    res.end()
                })
            })
        })
    },
    handlerStatic(req, res) {
        //处理静态资源
        let filePath = path.join(__dirname, req.url)
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.statusCode = 404
                res.end()
            }
            res.end(data)
        })
    },
    handler404(req, res) {
        res.writeHead(404, {
            'content-type': 'text/html;charset=utf-8'
        })
        res.end('404 你访问的资源不存在~~')
    }
}