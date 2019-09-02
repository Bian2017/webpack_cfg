'use strict'

const path = require('path')

module.exports = {
  entry: {
    index: './src/index.js',
    search: './src/search.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js' // 通过占位符确保文件名称的唯一
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
          'style-loader', // 将样式通过<style>标签插入到head中
          'css-loader' // 用于加载.css文件，并且转换成commonJS对象
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
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
            options: {
              limit: 102400 // 10K大小。如果资源小于10K大小，webpack打包的时候会自动对它进行base64编码。
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'] //用于处理文件，也可以处理字体
      }
    ]
  },
  /**
   * 插件用于 bundle 文件的优化，资源管理和环境变量注入。
   *
   * Plugins作用于整个构建过程。
   */
  plugins: []
}
