const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");
const { resolve, join } = require('path');
const ROOT_PATH = resolve(__dirname);
const NODE_PATH = resolve(ROOT_PATH, 'node_modules');
const SRC_PATH = resolve(ROOT_PATH, 'src');
module.exports = {
    // entry: "./src/index.js",
    // disableHostCheck: true,
    entry: {  //配置react热加载
        app: [
            'react-hot-loader/patch',
            path.join(__dirname, './src/index.js')
        ]
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
        // filename: "[name].js?v=[hash:6]",
        // chunkFilename: `chunks/[name].js?v=[hash:6]`
        // publicPath: "/assets/",
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
        overlay: {
            errors: true
        },
        disableHostCheck: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                // include: path.resolve(__dirname, 'src'),
                // exclude: /node_modules/,
                // use: ["style-loader", "css-loader", "./loader/px-rem.js"],//添加手写的px转rem的loader
                // use: ["style-loader", "css-loader?modules&sourceMap", "./loader/px-rem.js"], // 限制模块作用域以及sourceMap
                use: ["style-loader", "css-loader"]
                // use: ["style-loader", "css-loader?modules&sourceMap"],
            },
            {
                test: /\.less$/,
                // include: [SRC_PATH],
                // exclude: [NODE_PATH],
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                use: [{
                    loader: "style-loader" // 将 JS 字符串生成为 style 节点
                }, {
                    loader: "css-loader", // 将 CSS 转化成 CommonJS 模块
                    options: {
                        modules: true,
                        modules: {
                            // localIdentName: '[path][name]__[local]--[hash:base64:5]',
                            localIdentName: '[local]--[hash:base64:5]',
                        },
                    }
                },
                {
                    loader: 'px2rem-loader',
                    // options here
                    options: {
                        remUnit: 37.5,
                        remPrecision: 8
                    }
                },
                {
                    loader: "less-loader",// 将 less 编译成 CSS
                    options: {
                        modules: true,
                    }
                }]
            },
            // {
            //     test: /\.less$/,
            //     include: [SRC_PATH],
            //     exclude: [COMPONENTS_PATH],
            //     use: [
            //         'style-loader',
            //         {
            //             loader: 'css-loader',
            //             options: {
            //                 modules: true,
            //                 localIdentName: options.env === 'dev' ? '[path][name]__[local]' : '[hash:base64:8]'
            //                 // todo: sourceMap 开启，html内嵌样式会变成blob资源，导致样式渲染变慢，会出现未渲染的HTML结构
            //                 // sourceMap: true,
            //                 // localIdentName: '[path][name]__[local]--[hash:base64:5]'  // 添加hash会增加自动测试脚本编写难度
            //             }
            //         },
            //         {
            //             loader: 'less-loader',
            //             op
            //     test: /\.less$/,
            //     include: [SRC_PATH],
            //     exclude: [COMPONENTS_PATH],
            //     use: [
            //         'style-loader',
            //         {
            //             loader: 'css-loader',
            //             options: {
            //                 modules: true,
            //                 localIdentName: options.env === 'dev' ? '[path][name]__[local]' : '[hash:base64:8]'
            //                 // todo: sourceMap 开启，tions: {
            //                 javascriptEnabled: true
            //                 // sourceMap: true,
            //                 // globalVars: config.globalVars
            //             }
            //         }
            //     ]
            // },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ["file-loader"]
            },
            {
                test: /.(jsx|js)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react', '@babel/preset-env'],
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
            },

            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(), //清空输出目录
        new HtmlWebpackPlugin({  //定义HTML模板
            title: '脚手架',
            template: 'src/index.html'
        }),
        new webpack.NamedModulesPlugin(),   //react 热加载
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        mainFiles: ["index", "Index"],
        extensions: [".js", ".jsx", ".json"],
        modules: ["node_modules", "web_components", "web_modules"],  // redux for actions reducers constants
        // alias: {
        //     router: ROUTER_PATH,
        //     // layout: LAYOUT_PATH
        // }
    }
};
