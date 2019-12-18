
const express = require('express');
const app = express();
const index = require('./routers/index.js')

module.exports = class{
    constructor(){
        this.initApp();
    }
    initApp(){
        app.use('/', index())
        app.listen(5000);
    }
}



// const express = require('express');
// const {join, resolve, extname} = require("path");
// const {pick} = require("lodash");
// const {renderFile} = require('ejs');
// const favicon = require('serve-favicon');
// const logger = require('morgan');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// const pkg = require('./package.json');

// const http = require('http');
// const debug = require('debug')('server:server');

// const index = require('./routes/index');
// const users = require('./routes/users');
// const api = require('./routes/api');

// const staticConfig = require('./config/static');


// module.exports = class {
//     constructor(options = {}, app) {
//         console.log(`\n[Node Server]\n${JSON.stringify(options, null, 4)}\n`);
//         this.options = {
//             ...options,
//             _package: pkg,
//             port: this.normalizePort(options.port),
//         };

//         this.app = app;
//         this.initApp();
//         this.initServer();
//     }

//     initApp() {
//         this.app = this.app || express();
//         this.app.disable('x-powered-by');
//         this.app.set('env', this.options['env'] === 'dev' ? 'development' : 'production');
//         // view engine setup
//         this.app.set('views', join(this.options['page-path'], 'views'));
//         // 设置模板文件后缀为.html
//         this.app.engine('html', renderFile);
//         this.app.set('view engine', 'html');
//         // 处理浏览器默认请求/favicon.ico
//         this.app.use(favicon(resolve(this.options['public-path'], 'resource', 'statics/images/favicon.png')));
//         this.app.use(express.static(resolve(this.options['public-path'], 'resource'), staticConfig));

//         this.app.use(logger(this.options['env'] === 'dev' ? 'dev' : 'common'));
//         // this.app.use(bodyParser.json());
//         // this.app.use(bodyParser.urlencoded({ extended: false }));
//         // this.app.use(cookieParser());

//         this.app.use('/', index(this));

//         // catch 404 and forward to error handler
//         this.app.use((req, res, next) => {
//             let err = new Error('Not Found');
//             err.status = 404;
//             next(err);
//         });

//         // error handler
//         this.app.use((err, req, res, next) => {
//             if (this.options['env'] === 'dev') {
//                 err.status = err.status || 500;
//                 res.locals.error = pick(err, ['message', 'status', 'stack']);
//             } else {
//                 err.status = err.status || 404;
//                 res.locals.error = pick(err, ['message', 'status']);
//             }

//             // render the error page
//             res.status(err.status).render('error', {
//                 status: err.status,
//                 message: err.status === 404 ? '找不到页面' : '页面加载失败'
//             });
//         });

//         /**
//          * Get port from environment and store in Express.
//          */

//         this.app.set('port', this.options.port);
//     }

//     initServer() {
//         /**
//          * Create HTTP server.
//          */
//         this.server = http.createServer(this.app);
//         /**
//          * Listen on provided port, on all network interfaces.
//          */
//         this.server.listen(this.options.port);
//         /**
//          * Event listener for HTTP server "error" event.
//          */
//         this.server.on('error', (error) => {
//             if (error.syscall !== 'listen') {
//                 throw error;
//             }

//             let bind = typeof port === 'string'
//                 ? 'Pipe ' + this.options.port
//                 : 'Port ' + this.options.port;

//             // handle specific listen errors with friendly messages
//             switch (error.code) {
//                 case 'EACCES':
//                     console.error(bind + ' requires elevated privileges');
//                     process.exit(1);
//                     break;
//                 case 'EADDRINUSE':
//                     console.error(bind + ' is already in use');
//                     process.exit(1);
//                     break;
//                 default:
//                     throw error;
//             }
//         });

//         /**
//          * Event listener for HTTP server "listening" event.
//          */
//         this.server.on('listening', () => {
//             let addr = this.server.address();
//             let bind = typeof addr === 'string'
//                 ? 'pipe ' + addr
//                 : 'port ' + addr.port;
//             debug('Listening on' + bind);
//         });

//     }

//     close() {
//         return new Promise((resolve, reject) => {
//             this.server.close(() => {
//                 console.log(`[${new Date().toLocaleString()}][App Closed]\n`);
//                 resolve();
//             });
//         });
//     }

//     normalizePort(val) {
//         let port = parseInt(val, 10);

//         if (isNaN(port)) {
//             // named pipe
//             return val;
//         }

//         if (port >= 0) {
//             // port number
//             return port;
//         }

//         return false;
//     }
// };
