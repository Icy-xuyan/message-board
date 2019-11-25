const http = require('http')
const router = require('./router')
const server = http.createServer()

server.on('request', (req, res) => {
  router(req,res)
})

server.listen(9999, _ => {
  console.log('服务器监听成功 http://localhost:9999');
})