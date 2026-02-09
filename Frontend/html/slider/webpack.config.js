const path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin'); //打包html的插件
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry:'./src/entry.js',
    output:{
        path:path.resolve(__dirname, 'dist'),
        filename: 'js/js.bundle.js'
    },
    mode:'production',
    module:{
        rules:[
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: "css-loader",
                    fallback: "style-loader",
                    publicPath: '../' ,  //重点，不然路径不对。
                })
            },
            {
                test:/\.(jpg||png||jpeg)$/,
                loader:'file-loader',
                options:{
                    name:'textures/[name].[ext]',
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks:['demo'],
            filename:'index.html',
            template:'demo.html'
        }),
        new ExtractTextPlugin({
            filename:"css/bundle.css"
        }),
    ]

}
