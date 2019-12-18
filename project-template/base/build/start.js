const cluster = require('cluster');
const webpack1 = require('./webpack1');
const mockserver = require('./mock');
const options = require('./options');


if(process.env.NODE_ENV === 'build'){
    webpack1();
}else{
    if(cluster.isMaster) {
        console.log(`[Worker Master] PID: ${process.pid}`);
        // if (options.mock) {

        if(true){
            cluster.fork();
            cluster.on('exit', (worker, code, signal) => {
                console.log(`[Worker Child Died] PID: ${worker.process.pid} PPID: ${process.pid}\n`);
                // 子进程（Node Server）文件变化被终止后重启服务
                cluster.fork();
            });
        }
        webpack1();
    } else {
        // console.log(`\n[Worker Child] PID: ${process.pid} PPID: ${process.ppid}`);
        // 开启子进程用于启动和监听Node Server
        // mockserver(options);
    }
}
