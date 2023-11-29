const fs = require('fs');

// 服务器
const EXPRESS = require('express');
const SERVER = EXPRESS();
const PORT = 80;

const Stream = require('node-rtsp-stream');
// Name of the stream, used to identify it in the API
// new Stream({
//   name: 'socket',
//   streamUrl: 'rtsp://10.100.22.120/2',
//   wsPort: 9999,
//     // ffmpeg 的一些配置参数，比如转换分辨率等，大家可以去 ffmpeg 官网自行查询
//   ffmpegOptions: {
//     '-stats': '',
//     '-r': 20,
//     '-s': '1280 720'
//   }
// });

// 托管静态文件，使外部可以直接访问该文件夹下的静态资源
SERVER.use( EXPRESS.static('static') ) 

// 运行站点服务器
SERVER.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

// 创建socket服务器并运行
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 19898 });

// 读取文件

wss.on('connection', function connection(ws) {

  console.log("===== connection =====");

  // let buffer = fs.readFileSync('./static/src/Yours.aac');
  // let buffer = fs.readFileSync('./static/src/paudio.pcm');

  let buffer = fs.readFileSync('./static/src/0831.mp4');

  let index = 0;

  console.log(buffer.length)

  const id = setInterval(() => {
    if (index < buffer.length) {
      let fragmentSize = 10240;
      // 512B / fragment
      ws.send(buffer.slice(index, index + fragmentSize)); // 把（音）视频文件切片 发送给前端
      index += fragmentSize;
    } else {
      console.log(`数据传输完结束`);
      // 数据传输完结束
      clearInterval(id);
      ws.send("done");
      wss.close();
    }
  }, 21);

});