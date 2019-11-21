const http = require("http");
const fs = require("fs");
const path = require("path");
const mime = require("mime");
const template = require("art-template");
const URL = require("url");
const queryString = require("querystring");
const moment = require("moment");
const server = http.createServer();
let dbPath = path.join(__dirname, "data.json");

server.on("request", (req, res) => {
  let url = req.url;
  if (url.includes("/static")) {
    //静态资源：不需要服务器做任何处理 直接返回即可
    let filePath = path.join(__dirname, url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader("content-type", "text/html;charset=utf8");
        res.end("404");
        return;
      }
      res.end(data);
    });
  } else if (url === "/index" || url === "/") {
    let filePath = path.join(__dirname, "views", "index.html");
    fs.readFile(dbPath, (err, data) => {
      if (err) return console.log("读取数据库文件失败");
      let html = template(filePath, JSON.parse(data));
      res.end(html);
    });
  } else if (url.startsWith("/delete")) {
    /**
     * 1. 读取传过来的id
     * 2. 读取data.json文件
     * 3. 删除data.json中对应id的数据
     * 4. 更新data.json
     * 5. 返回首页
     */
    let id = URL.parse(url, true).query.id;
    fs.readFile(dbPath, (err, data) => {
      if (err) return console.log("读取数据库文件失败");
      data = JSON.parse(data);
      data.list = data.list.filter(item => item.id !== +id);
      fs.writeFile(dbPath, JSON.stringify(data, null, 2), err => {
        if (err) return console.log("写入数据库失败");
        res.writeHead(302, {
          Location: "/"
        });
        res.end();
      });
    });
  } else if (url.startsWith("/fb") && req.method === "GET") {
    /**
     * 获取添加的参数信息
     * 读取data.json文件
     * 添加
     * 更新data.json
     * 重定向回首页
     */
    let query = URL.parse(url, true).query;
    console.log(query);
    let addData = {
      ...query,
      id: +new Date(),
      time: moment().format("YYYY年MM月DD日 HH:mm:ss")
    };
    fs.readFile(dbPath, (err, data) => {
      if (err) return console.log("读取数据库文件失败");
      data = JSON.parse(data);
      data.list.unshift(addData);
      console.log(data);
      fs.writeFile(dbPath, JSON.stringify(data, null, 2), err => {
        if (err) return console.log("写入数据库失败");
        res.writeHead(302, {
          Location: "/"
        });
        res.end();
      });
    });
  } else if (url.startsWith("/fb") && req.method === "POST") {
    let result = "";
    req.on("data", chunk => {
      result += chunk;
    });
    req.on("end", () => {
      let query = queryString.parse(result);
      let addData = {
        ...query,
        id: +new Date(),
        time: moment().format("YYYY年MM月DD日 HH:mm:ss")
      };
      fs.readFile(dbPath, (err, data) => {
        if (err) return console.log("数据库文件读取失败");
        data = JSON.parse(data);
        data.list.unshift(addData);
        fs.writeFile(dbPath, JSON.stringify(data, null, 2), err => {
          if (err) return console.log("写入数据库文件失败");
          res.writeHead(302, {
            Location: "/"
          });
          res.end();
        });
      });
    });
  } else if (url === "/add") {
    let filePath = path.join(__dirname, "views", "add.html");
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader("content-type", "text/html;charset=utf8");
        res.end("404 你访问的服务器资源不存在");
        return;
      }
      res.end(data);
    });
  } else {
    res.statusCode = 404;
    res.setHeader("content-type", "text/html;charset=utf8");
    res.end("404");
  }
});

server.listen(9999, _ => {
  console.log("服务器启动成功 请访问: http://localhost:9999");
});
