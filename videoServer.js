const fs = require('fs');

// 服务器
const EXPRESS = require('express');
const SERVER = EXPRESS();
const PORT = 80;

// 托管静态文件，使外部可以直接访问该文件夹下的静态资源
SERVER.use( EXPRESS.static('static') ) 

// 运行站点服务器
SERVER.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

// 创建socket服务器并运行
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 19899 }); 

// 读取文件

let buffer = fs.readFileSync('./static/src/0831.mp4');
// let buffer = fs.readFileSync('./static/src/test.h264');

console.log(buffer)

wss.on('connection', function connection(ws) {

  console.log("===== connection =====")

  let index = 0;

  const id = setInterval(() => {
    if (index < buffer.length) {

      // 512B / fragment
      ws.send(buffer.slice(index, index + 51200)); // 把（音）视频文件切片 发送给前端
      index += 51200;

    } else {
      // 数据传输完结束
      clearInterval(id);
      ws.send("done")
      wss.close();
    }
  }, 21);

});

/*

*/