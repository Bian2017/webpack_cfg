'use strict'

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  /**
   * 文件监听的原理分析:
   *
   * 轮询判断文件的最后编辑时间是否变化。某个文件发生了变化，并不会立刻告诉监听者，而是先缓存起来，等aggregateTimeout。
   */
  // watch: true, //另外一种方式：启动webpack命令，带上 --watch 参数

  // 只有开启监听模式时，watchOptions才有意义
  watchOptions: {
    // 默认为空，不监听的文件或者文件夹，支持正则匹配。忽视node_modules会提升文件监听性能。
    ignored: /node_modules/,
    // 监听到变化发生后会等300ms再去执行，默认300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停询问系统指定文件有没有变化实现的，默认每秒问1000次
    poll: 1000
  },
  entry: {
    index: './src/index.js',
    search: './src/search.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    /**
     * 注意三种文件指纹的区别
     *
     * Hash: 和整个项目的构建有关，只要项目文件有修改，整个项目构建的hash值就会更改。
     * 示例：比方打包两个页面，修改了A页面的JS，即使没修改B页面的JS，B页面JS的hash值也会发生变化。
     *
     * Chunkhash: 和 webpack 打包的 chunk(模块) 有关，不同的 entry 会生成不同的 chunkhash 值。
     * 示例：每个页面如果有一个文件发生了变化，并不会影响其他页面，因此对于JS指纹会采用chunkhash。
     *
     * ContentHash: 根据文件内容来定义hash，文件内容不变，则 contenthash 不变。
     * 示例：某个页面既有JS资源，又有CSS资源。假设CSS资源采用Chunkhash，当修改了页面JS而CSS文件内容并没有变化，
     * 此时依旧会生成新的Chunkhash，无法利用缓存机制进行缓存。故针对CSS文件，会采用ContentHash。
     */
    filename: '[name]_[chunkhash:8].js' // 通过占位符确保文件名称的唯一
  },
  /**
   * Mode 用于指定当前的构建环境是：production、development还是none。
   *
   * 设置 mode 可以使用webpack内置的函数，默认值是production。
   */
  mode: 'production',
  /**
   * webpack 开箱即用只支持JS和JSON两种文件类型，通过Loaders去支持其他文件类型并且把它们转化为有效的模块，并且添加到依赖图中。
   *
   * Loaders本身是一个函数，接收源文件作为参数，返回转换的结果。
   */
  module: {
    /**
     * test 指定匹配规则
     * use 指定使用的loader名称
     */
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader' // 解析ES6，配置文件
      },
      {
        test: /\.css$/,
        /**
         * 注意：loader调用是链式调用，执行顺序是从右到左。
         */
        use: [
          // 'style-loader', // 将样式通过<style>标签插入到head中
          MiniCssExtractPlugin.loader, // 与style-loader是互斥的，一个是提取css成为一个独立文件，一个是将css插入页面中
          'css-loader' // 用于加载.css文件，并且转换成commonJS对象
        ]
      },
      {
        test: /\.less$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader, // 与style-loader是互斥的，一个是提取css成为一个独立文件，一个是将css插入页面中
          'css-loader',
          'less-loader' // 用于将less转换成css。less-loader依赖于less，所以需安装下less。
        ]
      },
      /**
       * url-loader也可以处理图片和字体。可以设置较小资源自动转base64，从而减少网络请求。
       */
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            /**
             * 注意图片、字体的hash是指文件内容的hash，与之前提到的CSS的contentHash类似。
             */
            options: {
              limit: 10240, // 10K大小。如果资源小于10K大小，webpack打包的时候会自动对它进行base64编码。
              name: '[name]_[hash:8].[ext]' // ext：资源后缀名
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader', //用于处理文件，也可以处理字体
            options: {
              name: '[name]_[hash:8].[ext]' // ext：资源后缀名
            }
          }
        ]
      }
    ]
  },
  /**
   * 插件用于 bundle 文件的优化，资源管理和环境变量注入。
   *
   * Plugins作用于整个构建过程。
   */
  plugins: [
    // 若使用了style-loader、css-loader，css会由style-loader将css插入到style标签内，并且放置head标签头部。
    // 这个时候并没有独立的css文件。因此通常需要MiniCssExtractPlugin插件将css文件提取出来作为一个独立的文件。
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    })
  ]
}
