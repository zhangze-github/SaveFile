// // 1 引入模块
// const net = require('net');
// // 2 创建服务器
// let clientArr = [];
// const server = net.createServer();
// // 3 绑定链接还事件
// server.on('connection',(person)=>{
//     console.log(clientArr.length);
// // 记录链接的进程
//     person.id = clientArr.length;
//     clientArr.push(person);
//     person.setEncoding('utf8');
// // 客户socket进程绑定事件
//     person.on('data',(chunk)=>{
//         console.log(chunk);
//
//         clientArr.forEach((val)=>{
// // 数据写入全部客户进程中
//             val.write(chunk);
//         })
//     })
//     person.on('close',(p1)=>{
//         clientArr[p1.id] = null;
//     } )
//     person.on('error',(p1)=>{
//         clientArr[p1.id] = null;
//     })
// })
// server.listen(8080);


/**
 * Created by jinduo.quan on 2018/10/26.
 */
/**
 * 参数：[socketOpen|socketClose|socketMessage|socketError] = func，[socket连接成功时触发|连接关闭|发送消息|连接错误]
 * forever：连接关闭后是否重连
 * maxConnect：最大重连次数，为always就一直重连
 * timeout：连接超时时间
 * @type {module.webSocket}
 */
module.exports =  class webSocket {
    constructor(param = {}) {
        this.param = param;
        this.reconnectCount = 0;
        this.socket = null;
        this.forceClose = false;
    }
    connection = () => {
        let {socketUrl, timeout = 0} = this.param;
        this.socket = new WebSocket(socketUrl);
        this.socket.onopen = this.onopen;
        this.socket.onmessage = this.onmessage;
        this.socket.onclose = this.onclose;
        this.socket.onerror = this.onerror;
        this.socket.sendMessage = this.sendMessage;
        this.socket.closeSocket = this.closeSocket;
        if(timeout) {
            let time = setTimeout(() => {
                if(this.socket && this.socket.readyState !== 1) {
                    this.socket.close();
                }
                clearInterval(time);
            }, timeout);
        }
    };
    onopen = () => {
        let {socketOpen} = this.param;
        socketOpen && socketOpen();
    };
    onmessage = (msg) => {
        let {socketMessage} = this.param;
        socketMessage && socketMessage(msg);
    };
    onclose = (e) => {
        let {socketClose, forever} = this.param;
        if(forever) {
            this.reconnection();
        } else {
            socketClose && socketClose({
                status: 101,
                msg: e
            });
        }
    };
    onerror = (e) => {
        let {socketError} = this.param;
        this.socket = null;
        socketError && socketError(e);
    };
    sendMessage = (value) => {
        if(this.socket) {
            this.socket.send(JSON.stringify(value));
        }
    };
    closeSocket = (forceClose = false) => {
        if (this.socket) {
            this.socket.close();
            this.forceClose = forceClose;
        }
    };
    reconnection = () => {
        let {maxConnect = 0, socketClose} = this.param;
        if(!this.forceClose && this.socket && (this.reconnectCount <= maxConnect || maxConnect === 'always') && this.socket.readyState === 3) {
            this.reconnectCount += 1;
            this.connection();
        } else {
            this.socket = null;
            let errorMsg = {};
            if(this.reconnectCount > maxConnect) {
                errorMsg = {
                    status: 101,
                    msg: '已到达最大重连次数'
                };
            } else {
                errorMsg = {
                    status: 102,
                    msg: '上个连接还未关闭'
                };
            }
            socketClose && socketClose({
                errorMsg
            });
        }
    };
};

