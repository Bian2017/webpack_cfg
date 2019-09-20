const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: {
    'large-number': './src/index.js', // 非压缩
    'large-number.min': './src/index.js' // 压缩
  },
  output: {
    filename: '[name].js',
    /**
     * 如何将库暴露出去？
     *
     * library: 指定库的全局变量。
     *
     * libraryTarget: 支持库引入的方式。
     */
    library: 'largeNumber', // 打包库的名字
    /**
     * umd --- 这个选项会尝试把库暴露给前使用的模块定义系统，这使其和CommonJS、AMD兼容或者暴露为全局变量。
     */
    libraryTarget: 'umd',
    libraryExport: 'default' // 不设置引用会比较麻烦。
  },
  mode: 'none', // 将mode设置为none，去除所有压缩(有的包不希望被压缩)
  optimization: {
    minimize: true,
    minimizer: [
      /**
       * 为什么使用terser-webpack-plugin压缩代码，而不用uglifyjs-webpack-plugin？
       *
       * 因为项目中使用了ES6语法，uglifyjs-webpack-plugin不支持ES6语法的压缩，所以使用terser-webpack-plugin。
       */
      new TerserPlugin({
        include: /\.min\.js$/ // 设置正则匹配，针对min.js才进行压缩
      })
    ]
  }
}
