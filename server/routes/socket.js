let express = require('express');
let app = express();
let router = express.Router();
let http = require('http').Server(app);
let io = require('socket.io')(http);
const iconv = require('iconv-lite')
const encoding = 'cp936'
const binaryEncoding = 'binary';

//http://localhost:3000/socket/shell
router.get('/shell',function(req,res,next){
    //let cmdStr = 'ls -l';
    let cmdStr = 'dir -l \\';
    executeShell(cmdStr,true,res);
});

  function toGBK (str) {
    return iconv.decode(Buffer.from(str, binaryEncoding), encoding)
  }
  //执行shell指令，返回结果
  function executeShell(cmdStr,isReq=false,res=null){
    let exec = require('child_process').exec;
    //let cmdStr = 'ls -l';
    //let cmdStr = 'dir -l \\';
    exec(cmdStr,{encoding:binaryEncoding} ,function (err, stdout, srderr ) {
      if(err){
        if(isReq){
            res.render('shell',{title:"shell execute error",stdout:toGBK(srderr)})
        }else{
            //向客户端发送消息
            res.emit('receive',toGBK(srderr));
        }
      }else{
        if(isReq){
            res.render('shell',{title:"shell execute",stdout:toGBK(stdout)})
        }else{
            //向客户端发送消息
            res.emit('receive',toGBK(stdout));
        }
      }
    });
  }
 
 //socket
io.on('connection', function (socket) {
    console.log('a user connected:'+socket.id);
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('receive', function (message) {
        console.log('message: ' + message);
        if(message==="hello"){
          console.log("来自客户端["+socket.id+"]的消息："+message)
        }else{
            if (io.sockets.connected[socket.id]) {
                executeShell(message,false,io.sockets.connected[socket.id]);
            }
        }
    });
});
 
let server = http.listen(4000, function () {
    console.log('Sever is running');
});


module.exports = router;



