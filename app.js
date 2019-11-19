const http = require('http')
const fs = require('fs')
const path = require('path')
const mime = require('mime')
const template = require('art-template')
const server = http.createServer()

server.on('request', (req, res) => {
    let url = req.url
    if (url.includes('/static')) {
        //静态资源：不需要服务器做任何处理 直接返回即可
        let filePath = path.join(__dirname, url)
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.statusCode = 404
                res.setHeader('content-type', 'text/html;charset=utf8')
                res.end('404')
                return
            }
            res.end(data)
        })
    } else if (url === '/index') {
        let filePath = path.join(__dirname, 'views', 'index.html')
        let dbPath = path.join(__dirname, 'data.json')
        fs.readFile(dbPath, (err, data) => {
            if(err) throw err
            let html = template(filePath, JSON.parse(data))
            res.end(html)
        })
    } else if (url === '/add') {
        let filePath = path.join(__dirname, 'views', 'add.html')
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.statusCode = 404
                res.setHeader('content-type', 'text/html;charset=utf8')
                res.end('404 你访问的服务器资源不存在')
                return
            }
            res.end(data)
        })
    } else {
        res.statusCode = 404
        res.setHeader('content-type', 'text/html;charset=utf8')
        res.end('404')
    }
})

server.listen(9999, _ => {
    console.log('服务器启动成功 请访问: http://localhost:9999');
})