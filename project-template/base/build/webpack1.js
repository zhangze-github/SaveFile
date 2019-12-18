const webpack = require('webpack');
const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve, join } = require('path');
const ROOT_PATH = resolve(__dirname);
// const NODE_PATH = resolve(ROOT_PATH, 'node_modules');
// const SRC_PATH = resolve(ROOT_PATH, 'src');
const WebpackDevServer = require('webpack-dev-server');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = function(){
    const webConfig = {
        mode: 'development',
        entry: {  //配置react热加载
            app: [
                'react-hot-loader/patch',
                path.join(__dirname, '../src/index.js')
            ]
        },
        output: {
            // filename: '[name].[hash].js',
            filename: '[name].js',
            path: path.resolve(__dirname, '../dist'),
            // filename: "[name].js?v=[hash:6]",
            // chunkFilename: `chunks/[name].js?v=[hash:6]`
            // publicPath: "/assets/",
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                },
                {
                    test: /\.less$/,
                    include: path.resolve(__dirname, '../src'),
                    use: [{
                        loader: "style-loader" // 将 JS 字符串生成为 style 节点
                    }, {
                        loader: "css-loader", // 将 CSS 转化成 CommonJS 模块
                        options: {
                            modules: true,
                            modules: {
                                localIdentName: '[local]--[hash:base64:5]',
                            },
                        }
                    },
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 37.5,
                            remPrecision: 8
                        }
                    },
                    {
                        loader: "less-loader",// 将 Less 编译成 CSS
                        options: {
                            modules: true,
                        }
                    }]
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: ["file-loader"]
                },
                {
                    test: /\.(js|jsx)$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                // presets: ['@babel/preset-react', '@babel/preset-env'],
                                presets: ['@babel/preset-react', ['@babel/env', { 'targets': { 'node': 6 } }]],
                                plugins: [
                                    ["@babel/plugin-proposal-decorators", { "legacy": true }],
                                    ["@babel/plugin-proposal-class-properties", { "loose" : true }],
                                    ['import', {
                                        libraryName: "antd",
                                        style: "css"
                                    }],
                                    ['lodash']
                                ]
                            }
                        }
                    ]
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
                },
                {
                    test: /\.(md)$/,
                    use: [
                        'raw-loader'
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
        }
    };

    if(process.env.NODE_ENV === 'development'){
        webConfig.devtool = 'eval-source-map';
    }else{
        webConfig.mode = 'production';
    }
    const compiler = webpack(webConfig);
    if(process.env.NODE_ENV === 'development'){
        new WebpackDevServer(compiler, {
            contentBase: '../dist',
            hot: true,
            overlay: {
                errors: true
            },
            disableHostCheck: true,
        }).listen('4000', () => {
            console.log(`[Webpack Server] Starting server on ${'localhost:4000'}`.green);
        });
    }else{
        compiler.run();
    }
}