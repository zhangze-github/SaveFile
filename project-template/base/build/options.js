const commander = require('commander');
const {pick} = require('lodash');
const {resolve} = require("path");
const pkg = require('../package.json');

// const envShortMap = require('../config/env-short-map.json');

commander
    .version(pkg.version, '-v, --version')

    .option('-l, --layout <type>', '布局类型', /^(portal|console)$/, 'portal')

    // .option('-e, --env <environment>', '环境类型', /^(dev|test|prod)$/, envShortMap[process.env.NODE_ENV] || 'prod')

    .option('--expose', '是否暴露jquery,moment到window上，只针对dev环境有效')

    .option('-s, --serve', '开启热加载服务')

    .option('-w, --watch', '监听文件变化')

    .option('--pull', '第一次执行脚本,获取路由组件最新代码')

    .option('--pull-branch <branch>', '拉取路由组件代码分支', /^(dev|test|prod)$/, 'dev')

    .option('--zip', '是否压缩编译包为zip文件')

    .option('--zip-level <n>', '压缩等级0-9,压缩率递增', Number, 9)

    .option('--serve-port <n>', '监听端口', Number, 4000)

    .option('--serve-host <host>', '监听地址', String, '0.0.0.0')

    .option('--mock', '启动模拟服务')

    .option('--mock-port <n>', '模拟服务端口', Number, 3000)

    .option('--mock-host <host>', '模拟服务host', String, 'dev2.baiqishi.com')

    .option('--mock-env <environment>', '模拟服务端环境', /^(dev|test|prod)$/, 'dev')

    .option('--mock-offline', '模拟服务开发状态，离线开发')

    .option('--mock-proxy-origin <url>', '模拟服务开发状态，离线开发', String, 'http://dev2.baiqishi.com:8090')

    .option('--mock-proxy-auth [path]', '模拟服务开发代理认证请求', String) // default value of '/ams/login/status.json' on layout is 'default'.

    .option('--mock-proxy-login [path]', '模拟服务开发代理登录页', String) // default value of '/ams/login' on layout is 'default'.

    .option('--mock-path <path>', '模拟服务路径', String, resolve(__dirname, '../../server'))

    .option('--mock-public-path <path>', '模拟服务公共静态资源目录', String, resolve(__dirname, '../../server-public'))

    .option('--mock-page-path <path>', '模拟服务页面资源目录', String, resolve(__dirname, '../../server-page'))

    .option('--mock-react-path <path>', '模拟服务react静态资源目录', String, resolve(__dirname, '../server-react'))

    .option('--dist-path <path>', '编译后的代码存放目录（相对于基础框架根目录）', String, '') // ./dist

    .option('--src-prefix <path>', '浏览器http资源请求前缀地址', String, '/')

    .usage('[options]')

    .parse(process.argv)
;

// console.log(commander);

module.exports = pick(commander, [
    'layout',
    'env',
    'expose',
    'serve',
    'watch',
    'pull',
    'pullBranch',
    'zip',
    'zipLevel',
    'servePort',
    'serveHost',
    'mock',
    'mockPort',
    'mockHost',
    'mockEnv',
    'mockOffline',
    'mockProxyOrigin',
    'mockProxyAuth',
    'mockProxyLogin',
    'mockPath',
    'mockPublicPath',
    'mockPagePath',
    'mockReactPath',
    'distPath',
    'srcPrefix'
]);
