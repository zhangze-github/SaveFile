const {keys} = require('lodash');
const {join, sep} = require('path');
// const colors = require('colors');
const {watchTree, unwatchTree} = require('watch');
const {toJson} = require('./utils');

const layoutUriPrefix = {
    portal: 'ams',
    console: 'bms'
};

module.exports = function (options = {}, webpackServerApp) {
    const mockServer = require('../../server/App');

    let app = new mockServer({
        "env": options.mockEnv,
        "offline": options.mockOffline,
        "port": options.mockPort,
        "proxy-origin": options.mockProxyOrigin,
        "proxy-auth": options.mockProxyAuth || `/${layoutUriPrefix[options.layout]}/login/status.json`,
        "proxy-login": options.mockProxyLogin || `/${layoutUriPrefix[options.layout]}/login`,
        "public-path": options.mockPublicPath,
        "page-path": options.mockPagePath,
        "react-path": options.mockReactPath,
        "react-type": options.layout
    }, webpackServerApp);

    // 监听Node Server routes目录文件变化
    watchTree(options.mockPath, {
    // watchTree(options['mock-path'], {
        filter: (path, fileInfo) => [
            'routes', 'config', 'App.js', 'package.json'
            //  'App.js', 'package.json'
        ].some(str => path.indexOf(join(options.mockPath, str)) > -1)
        // ].some(str => path.indexOf(join(options.mockPath, str)) > -1)
    }, (f, curr, prev) => {
        if (typeof f === "object" && prev === null && curr === null) {
            // 完成文件监听
            console.log("node 重新构建成功");
            console.log(`[Node Server][Walking Finished]\n${toJson(keys(f))}\n`);
        } else if (prev === null) {
            // 监听目录有新文件被创建
            console.log("有新文件被创建，重新构建成功");
            console.log(`[Node Server][File Created]\n${toJson(f)}\n`);
        } else if (curr.nlink === 0) {
            // 监听文件被删除
            console.log("有文件被删除，重新构建成功")
            console.log(`[Node Server][File Removed]\n${toJson(f)}\n`);
        } else {
            // 监听文件发生变化，关闭服务，退出进程
            console.log("有文件发生变化，关闭服务，退出进程")
            console.log(`[Node Server][File Changed]\n${toJson(f)}\n`);
            app.close().then(() => {
                process.exit(0);
            });
        }
    });
};
