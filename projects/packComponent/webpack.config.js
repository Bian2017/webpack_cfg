const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: {
    'large-number': './src/index.js', // 非压缩
    'large-number.min': './src/index.js' // 压缩
  },
  output: {
    filename: '[name].js',
    /**
     * library: 打包库的名字，即入口文件的返回值。
     */
    library: 'largeNumber',
    /**
     * libraryTarget: 控制 webpack 打包的内容是如何暴露的。需与output.library所绑定的值一起作用。
     *
     * umd---这个选项会尝试把库暴露给前使用的模块定义系统，这使其和CommonJS、AMD兼容或者暴露为全局变量。最终输出代码格式如下：
     *
     * ```JS
     *(function webpackUniversalModuleDefinition(root, factory) {
     *  if(typeof exports === 'object' && typeof module === 'object')
     *    module.exports = factory();
     *  else if(typeof define === 'function' && define.amd)
     *    define([], factory);
     *  else if(typeof exports === 'object')
     *    exports["MyLibrary"] = factory();
     *  else
     *    root["MyLibrary"] = factory();
     *})(typeof self !== 'undefined' ? self : this, function() {
     *  return _entry_return_;
     *});
     * ```
     */
    libraryTarget: 'umd',
    /**
     * 入口点的默认导出将分配给库目标。不设置引用会比较麻烦。
     *
     * ```JS
     * // if your entry has a default export of `MyDefaultModule`
     * var MyDefaultModule = _entry_return_.default;
     * ```
     */
    libraryExport: 'default'
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
