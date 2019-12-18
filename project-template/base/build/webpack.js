const webpack = require('webpack');
const {DefinePlugin, HashedModuleIdsPlugin} = webpack;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');
const TerserPlugin = require('terser-webpack-plugin');
const httpProxy = require('http-proxy-middleware');
const simpleGit = require('simple-git');
const archiver = require('archiver');
const moment = require('moment');
const open = require('open');
const colors = require('colors');
const {globalVars, modifyVars} = require('../config/theme');
const v = require("../config/version");
const {version} = require('../package.json');
const {resolve, join} = require('path');
const {readdirSync, statSync, lstatSync, existsSync, createWriteStream} = require("fs");
const {isEmpty, round} = require('lodash');
const {toJson} = require('./utils');

const envLongMap = require('../config/env-long-map.json');
const envNameMap = require('../config/env-name-map.json');
const singlePages = require('../config/single-pages');

module.exports = function (options = {}) {
    const WEB_PORT = options.servePort;
    const WEB_HOST = options.serveHost;
    const LOCAL_PUBLIC_PATH = 'http://' + WEB_HOST + ':' + WEB_PORT + '/';

    const MOCK_HOST = options.mockHost;
    const MOCK_PORT = options.mockPort;
    const MOCK_URL = `http://${MOCK_HOST}:${MOCK_PORT}`;

    // 项目相关路径
    const ROOT_PATH = resolve(__dirname, '../');
    const SRC_PATH = resolve(ROOT_PATH, 'src');
    const DIST_PATH = resolve(ROOT_PATH, options.distPath === '' ? join('dist', options.env, version) : join(options.distPath), options.layout);

    const NODE_PATH = resolve(ROOT_PATH, 'node_modules');
    const ROUTER_PATH = resolve(SRC_PATH, 'web_router');
    const COMPONENTS_PATH = resolve(SRC_PATH, 'web_components');
    const LAYOUT_PATH = resolve(COMPONENTS_PATH, 'layout');
    const REQUEST_BASE_PATH = options.srcPrefix;

    const compiler_conf = {};
    // 打包模式
    compiler_conf.mode = options.env === 'dev' ? 'development' : 'production';
    // 入口文件
    compiler_conf.entry = {
        index: join(SRC_PATH, 'app.js')
    };
    // 输出目录
    compiler_conf.output = {
        path: DIST_PATH,
        publicPath: REQUEST_BASE_PATH,
        filename: options.env === 'dev' ? "[name].js?v=[chunkhash:6]" : `[name].js?v=[chunkhash:6]_${v.localVersion}`,
        chunkFilename: options.env === 'dev' ? `chunks/[name].js?v=[chunkhash:6]` : `s/[name].js?v=[chunkhash:6]_${v.localVersion}`
    };

    // webpack 模块导入配置
    compiler_conf.module = {
        rules: [
            {
                test: /\.css$/,
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: options.env !== 'dev'
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                include: [COMPONENTS_PATH],
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: options.env !== 'dev'
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true,
                            urlArgs: v.staticVersion
                            // modifyVars,
                            // globalVars
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                include: [SRC_PATH],
                exclude: [COMPONENTS_PATH],
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: options.env === 'dev' ? '[path][name]__[local]' : '[hash:base64:8]'
                            // todo: sourceMap 开启，html内嵌样式会变成blob资源，导致样式渲染变慢，会出现未渲染的HTML结构
                            // sourceMap: true,
                            // localIdentName: '[path][name]__[local]--[hash:base64:5]'  // 添加hash会增加自动测试脚本编写难度
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true
                            // sourceMap: true,
                            // globalVars: config.globalVars
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                include: join(SRC_PATH, 'statics', 'images'),
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'statics/images/',
                            name: '[name].[ext]'
                        }
                    }
                    // ,
                    // {
                    //     loader: 'url-loader',
                    //     options: {
                    //         limit: 8192
                    //     }
                    // }
                ]
            },
            {
                test: /\.(eot|woff|ttf|svg)$/,
                include: join(SRC_PATH, 'statics', 'fonts'),
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'statics/fonts/',
                            name: '[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(txt|md)$/,
                use: 'raw-loader'
            },
            {
                test: /\.(js|jsx)$/,
                include: '../src',
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: options.env !== 'dev',
                            presets: ['react', 'stage-1'],
                            // plugins: [
                            //     ['transform-decorators-legacy'],
                            //     ['transform-runtime'],  //index-2: { helpers: true, polyfill: true, regenerator: true, moduleName: 'babel-runtime'}
                            //     ['import', {
                            //         libraryName: 'bqs',
                            //         libraryDirectory: '',
                            //         style: true
                            //     }],
                            //     ['lodash']
                            // ]
                            plugins: [
                                '@babel/plugin-proposal-class-properties',
                                // ["import",
                                //     {
                                //         libraryName: "antd-mobile",
                                //         style: "css"
                                //     }
                                // ],
                                ["import",
                                    {
                                        libraryName: "antd",
                                        // libraryDirectory: "lib",   // default: lib
                                        style: "css"
                                    },
                                ]
                                // ["import", [
                                //     {
                                //         libraryName: "antd",
                                //         libraryDirectory: "lib",   // default: lib
                                //         "style": true
                                //     },
                                //     {
                                //         libraryName: "antd-mobile",
                                //         libraryDirectory: "component",
                                //     },
                                // ]]
                            ] //antd按需就加载
                        }
                    }
                ]
            }
        ]
    };
    // 压缩JS、CSS代码
    compiler_conf.optimization = {
        splitChunks: {
            chunks: "initial",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    priority: -10
                },
                default: {
                    chunks: "async",
                    minChunks: Infinity,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },
        minimize: options.env !== 'dev',
        minimizer: options.env === 'dev' ? undefined : [
            new TerserPlugin({
                parallel: true,
                extractComments: false,
                terserOptions: {
                    ecma: undefined,
                    warnings: false,
                    parse: {},
                    compress: {
                        warnings: false,
                        drop_debugger: true,
                        drop_console: true
                    },
                    mangle: true, // Note `mangle.properties` is `false` by default.
                    module: false,
                    output: {
                        comments: false
                    },
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: undefined,
                    keep_fnames: false,
                    safari10: false
                }
            }),
            new OptimizeCSSAssetsPlugin({
                assetNameRegExp: /\.css\?/g
            })
        ]
    };

    compiler_conf.plugins = [];
    // 清空目录
    compiler_conf.plugins.push(
        new CleanWebpackPlugin([`${DIST_PATH}/**/*`], {
            root: ROOT_PATH,
            verbose: true,
            watch: false
        })
    );
    // 分离出静态样式文件
    compiler_conf.plugins.push(
        new MiniCssExtractPlugin(options.env === 'dev' ? {
            filename: "style.css",
            chunkFilename: "chunks/styles/[name].css?v=[chunkhash:6]"
        } : {
            filename: `style.css?v=${v.staticVersion}`,
            chunkFilename: `s/styles/[name].css?v=[chunkhash:6]_${v.localVersion}`
        })
    );
    // 确保模块ID最小化变化
    compiler_conf.plugins.push(
        new HashedModuleIdsPlugin()
    );

    // 关键字替换
    compiler_conf.plugins.push(
        new DefinePlugin({
            "__LAYOUT__": JSON.stringify(options.layout),
            "__VERSION__": JSON.stringify(version),
            "__DEV__": JSON.stringify(options.env === 'dev'),
            "__ENV_NAME__": JSON.stringify(envNameMap[options.env]),
            "process.env.NODE_ENV": JSON.stringify(envLongMap[options.env])
        })
    );

    // 独立页面
    compiler_conf.plugins.push(
        new HtmlWebpackPlugin(options.env === 'dev' ? {
            title: `白骑士(开发${options.mockOnline ? 'Online' : ''})`,
            inlineSource: 'style.css',
            template: join(SRC_PATH, 'index.html'),
            filename: join(DIST_PATH, 'index.html'),
            // favicon: join(SRC_PATH, 'statics/images/favicon.png'),
            hash: true
            // ,
            // chunksSortMode: function(chunk1, chunk2) {
            //     let order = ['vendor', 'polyfill', 'index'];
            //     var order1 = order.indexOf(chunk1.names[0]);
            //     var order2 = order.indexOf(chunk2.names[0]);
            //     return order1 - order2;
            // }
        } : {
            title: "<%= title || '白骑士' %>",
            template: join(SRC_PATH, 'index.html'),
            filename: join(DIST_PATH, 'index.html'),
            hash: false
        })
    );

    // 添加模块扩展和目录
    compiler_conf.resolve = {
        mainFiles: ["index", "Index"],
        extensions: [".js", ".jsx", ".json"],
        modules: ["node_modules", "web_components", "web_modules"],  // redux for actions reducers constants
        alias: {
            router: ROUTER_PATH,
            // layout: LAYOUT_PATH
        }
    };
    // compiler_conf.watch = config.watch;

    if (options.env === 'dev') {
        /**devtool
         |devtool                           |build|rebuild|production|quality
         |(none)                            |+++|+++|yes|bundled|code
         |eval                              |+++|+++|no|generated code
         |cheap-eval-source-map             |+|++|no|transformed code (lines only)
         |cheap-module-eval-source-map      |o|++|no|original source (lines only)
         |eval-source-map                   |--|+|no|original source
         |cheap-source-map                  |+|o|yes|transformed code (lines only)
         |cheap-module-source-map           |o|-|yes|original source (lines only)
         |inline-cheap-source-map           |+|o|no|transformed code (lines only)
         |inline-cheap-module-source-map    |o|-|no|original source (lines only)
         |source-map                        |--|--|yes|original source
         |inline-source-map                 |--|--|no|original source
         |hidden-source-map                 |--|--|yes|original source
         |nosources-source-map              |--|--|yes|without source content

         note: +++ super fast, ++ fast, + pretty fast, o medium, - pretty slow, -- slow

         **/
        // compiler_conf.devtool = 'eval-source-map';
        compiler_conf.devtool = 'cheap-module-eval-source-map';
        if (options.expose) {
            // 暴露一些工具到window对象
            compiler_conf.module.rules.push(
                {
                    test: require.resolve('jquery'),
                    use: [{
                        loader: 'expose-loader',
                        options: 'jQuery'
                    }, {
                        loader: 'expose-loader',
                        options: '$'
                    }]
                },
                { // window 对象暴露moment
                    test: require.resolve('moment'),
                    use: [{
                        loader: 'expose-loader',
                        options: 'moment'
                    }]
                },
                { // window 对象暴露nprogress
                    test: require.resolve('nprogress'),
                    use: [{
                        loader: 'expose-loader',
                        options: 'NProgress'
                    }]
                }
            );
        }
    } else {
        compiler_conf.performance = {
            maxEntrypointSize: 2000000, // ~2M
            maxAssetSize: 1000000, // ~1M
        };
    }

    const log_stats_conf = {
        chunks: false, // Makes the build much quieter
        // chunkModules: false, // Add built modules information to chunk information
        // source: false,  // Add the source code of modules
        children: false, // Add children information
        maxModules: 0,
        colors: options.env === 'dev'
    };

    const compiler = webpack(compiler_conf);

    console.log(`\n[Version]`, version.underline, "\n");
    console.log(`[Webpack Server]\n${toJson(options)}`, "\n");

    if (options.serve) {
        new WebpackDevServer(compiler, {
            hot: true,
            port: WEB_PORT,
            inline: true,
            compress: true,
            stats: log_stats_conf,
            headers: {
                "X-UI-V": version
            },
            staticOptions: {
                redirect: false
            },
            before(app) {
                app.all([/^\/(?!(chunks|s)\/).*\/.*\.\w*/, ...singlePages], httpProxy({
                    target: MOCK_URL,
                    logLevel: 'debug',
                    onProxyReq: (proxyReq, req, res) => {
                        console.log(`[Webpack Single Page Proxy] ${req.path} to ${MOCK_URL}\n${toJson(req.headers)}`);
                    }
                }));
            },
            // Set this as true if you want to access dev server from arbitrary url.
            // This is handy if you are using a html5 router.
            historyApiFallback: true,
        }).listen(WEB_PORT, WEB_HOST, () => {
            console.log(`[Webpack Server] Starting server on ${LOCAL_PUBLIC_PATH}`.green);
        });

    } else {
        if (options.pull) {
            // 切换分支，拉取代码，编译
            let branchName = options.pullBranch || (options.env === 'prod' ? 'master' : options.env);
            console.log(`[Git Checkout] Switch branch to ${branchName}\n`);
            updateRouterReps(branchName, ROUTER_PATH).then(compilerHandle);
        } else {
            // 直接编译
            compilerHandle();
        }
    }

    /**
     * 拉取更新所有路由组件代码
     * @param branchName  分支名称
     * @param rootRepoPath  路由组件目录
     * @returns {Promise<any[]>}
     */
    async function updateRouterReps(branchName = 'master', rootRepoPath = '.') {
        let repoPath = readdirSync(rootRepoPath)
            .map((name) => join(rootRepoPath, name))
            // 目录文件存在
            .filter(path => existsSync(join(path, '.git')) && lstatSync(path).isDirectory());

        console.log(`[Git Pull][Start] Pull all repo of router component.\n`);

        let result = await Promise.all(repoPath.map((path) => new Promise((resolve, reject) => {
            simpleGit(path).checkout(branchName)
            // .exec(() => console.log('Starting pull...'))
                .pull((err, summary) => {
                    // console.log(`\n[Pull Summary] ${path.underline}\n${toJson(summary)}`);
                    if (err) {
                        console.log(`[Git Pull Fail] ${path}`);
                        reject(err);
                        throw new Error(`[Git Pull Fail] ${path}`);
                    } else {
                        summary.path = path;
                        resolve(summary);
                    }
                })
            // .exec(() => console.log('pull done.'));
        })));

        console.log(`\n[Git Pull][End]\n${toJson(result)}`);
        return result;
    }

    /**
     * 开始编译项目
     */
    function compilerHandle() {
        let compilerAction = compilerInfo.bind(null, moment());
        // 直接执行编译
        if (options.watch) {
            console.log("\n[Webpack Compile][Start][Watch]\n");
            compiler.watch({ // watch options:
                aggregateTimeout: 300, // wait so long for more changes
                poll: 1000, // use polling instead of native watchers
                            // pass a number to set the polling interval
                // ignored: new RegExp(`^(?!${SRC_PATH}).*$`) // 只监听src目录，除了src目录，其它目录都忽略
                ignored: /node_modules/
            }, compilerAction);
        } else {
            console.log("\n[Webpack Compile][Start]\n");
            compiler.run(compilerAction);
        }
    }

    /**
     * 打印编译信息
     * @param startMoment
     * @param err
     * @param stats
     */
    function compilerInfo(startMoment, err, stats) {
        if (err) throw err;
        let endMoment = moment();
        // const info = stats.toJson();

        // if (stats.hasErrors()) console.error(info.errors);
        // else if (stats.hasWarnings()) console.warn(info.warnings)
        // else {
        console.log(stats.toString(log_stats_conf));
        // }
        if (stats.hasErrors()) {
            // 非开发环境则退出进程并抛出stderr
            options.env !== 'dev' && process.exit(1);
        } else {
            console.log(`\n[Webpack Compile][End] Compiled successfully.(${Math.round((endMoment - startMoment) / 1000)}s)`.green);
            options.zip &&
            !options.mock &&
            !options.serve &&
            createZipFile(DIST_PATH, options.zipLevel, options.env);
        }
    }

    /**
     * 创建压缩文件
     * @param distPath
     * @param zipLevel
     * @param env
     */
    function createZipFile(distPath, zipLevel = 9, env) {
        let archiveDir = resolve(distPath, '../');
        let createFile = resolve(archiveDir, '../server-react.zip');
        let output = createWriteStream(createFile);
        let archive = archiver('zip', {
            zlib: {level: zipLevel} // 压缩比例，0-9，压缩率递增.
        });

        console.log(`\n[Zip][Start]\nCompress directory from ${archiveDir}`.green);

        output.on('close', () => {
            console.log(`[Zip][End]\nCreate total size ${round(archive.pointer() / 1024 / 1024, 2)}MB file to ${createFile} successfully`.green);
        });

        archive.on('error', (err) => {
            console.error(err);
        });

        archive.pipe(output);

        archive.directory(archiveDir, '');

        archive.finalize();
    }
};

