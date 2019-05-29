<template>
 <div id="demoPage">
     <button type="button" class="btn" @click="execute">发送shell命令 "ls -l"</button>
     <div class="result"> 
      

     </div>
 </div>
    
</template>

<script>
import 'xterm/dist/xterm.css'
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit'
import * as attach from 'xterm/lib/addons/attach/attach'
Terminal.applyAddon(fit)
Terminal.applyAddon(attach)


export default {
    data() {
        return {
            term:null,
            terminalSocket:null,
            cmdStr:'dir -l \\'//'ls -l'
        }
    },
    mounted() {
        let terminalContainer = document.getElementById('terminal-container')
        this.term = new Terminal({
            cols: 60,
            rows: 20,
            cursorBlink: true, // 光标闪烁
            cursorStyle: "underline", // 光标样式  null | 'block' | 'underline' | 'bar'
            scrollback: 400, //回滚
            tabStopWidth: 4, //制表宽度
            screenKeys: true,
            cursorBlink: 5,
            scrollback: 30,
            tabStopWidth: 4
        });
        this.term.open(terminalContainer)
        this.term.write("mounted is going on\r\n")
        this.term.fit();
    },
    //（socket.on）绑定事件放在sockets中
    sockets:{ 
      // 创建连接
      connect(){
        console.log('连接成功啦')
        this.term.write("连接成功...\r\n")
        this.term.fit();
        //向服务端发消息
        this.$socket.emit('receive',"hello");
      },
      receive(message){
        console.log("来自服务器端的消息："+message)
        this.term.write(message)
        this.term.fit();
      }
    },
    methods: {
        execute(){
            this.$socket.emit('receive',this.cmdStr);  
        }
    }
}
</script>

<style lang="scss" scoped>
#demoPage{
.btn{
    width: 200px;
    height: 40px;
    border: 0;
    background: blue;
    color: #fff;
    font-size: 18px;
    &:hover{
      cursor: pointer;
      background: rgba($color: blue, $alpha: 0.7)
    }
  }
  .result{
      margin: 20px auto;
      padding:10px 50px 
  }
}
  
</style>



