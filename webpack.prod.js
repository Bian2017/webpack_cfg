'use strict'

const path = require('path')
const glob = require('glob')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

/**
 * 多页面应用(MPA)概念：每一次页面跳转的时候，后台服务器都会返回一个新的HTML文档。这种类型的
 * 网站就是多页网站，也叫多页应用。
 *
 * 多页面打包通用方案：动态获取entry和设置html-webpack-plugin数量。
 * 约定：将入口文件都设置成index.js，模板文件设置成index.html
 */
const setMPA = () => {
  const entry = {}
  const htmlWebpackPlugins = []

  // 以同步的方式把文件查询出来。
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))

  Object.keys(entryFiles).map(index => {
    const entryFile = entryFiles[index]
    const match = entryFile.match(/src\/(.*)\/index\.js/)
    const pageName = match && match[1]

    entry[pageName] = entryFile

    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`), //HTML模板文件所在位置
        filename: `${pageName}.html`, // 打包出来的HTML文件名称
        chunks: [pageName], // 指定生成的HTML要使用哪些chunk
        inject: true, // 打包的chunk，像JS、CSS会自动注入HTML中
        // 压缩HTML
        minify: {
          html5: true,
          collapseWhitespace: true, // 移除空格
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true // 移除注释
        }
      })
    )
  })

  return {
    entry,
    htmlWebpackPlugins
  }
}

const { entry, htmlWebpackPlugins } = setMPA()

module.exports = {
  entry,
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
          'less-loader', // 用于将less转换成css。less-loader依赖于less，所以需安装下less。

          /**
           * CSS3的属性为什么需要前缀？因为浏览器的标准并未完全统一。
           *
           * 目前主流四种浏览器内核：
           * + IE (内核Trident，要兼容该内核，编写的CSS需要加前缀-ms)
           * + 火狐 (内核Geko，要兼容该内核，编写的CSS需要加前缀前缀-moz)
           * + Chrome (内核Webkit，要兼容该内核，编写的CSS需要加前缀前缀-webkit)
           * + Opera (内核Presto，要兼容该内核，编写的CSS需要加前缀前缀-o)
           */
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                /**
                 * autoprefixer 插件可以自动补齐CSS3前缀，与 postcss-loader一起配合使用。
                 * 该插件是CSS的后处理器，而less-loader是预处理器，其中预处理器是指打包前进行处理，
                 * 后处理器是指样式处理(代码最终生成)之后，再对它进行后续处理。
                 */
                require('autoprefixer')({
                  // 指定兼容浏览器的版本
                  overrideBrowserslist: ['last 2 version', '>1%', 'ios 7'] // 参数一表示兼容最近两个版本，参数二指定浏览器版本使用人数所占的比例, 参数三表示兼容IOS 7版本以上
                })
              ]
            }
          },
          /**
           * 不同手机终端分辨率不一样，前端有时需进行不同页面的适配。
           * + 传统方案：通过CSS媒体查询(@media)实现响应式布局。缺陷：需写多套适配样式代码，影响开发效率。
           * + 使用rem(相对单位)。
           *
           * 编写样式代码希望根据设计稿(375或750)按照px单位编写样式，然后通过构建工具自动将px转化成rem?
           * 可借助px2rem-loader工具，它会将px自动转成rem。转换成rem之后，还需知道1个rem单位代表多少个px。
           * 这时需在页面打开的时候，动态地计算根元素的font-size的值。手淘的lib-flexible库(必须通过内联方式引用)
           * 会自动根据当前设备的宽高来计算根元素实际的font-size的值。
           *
           * 有些样式不想进行转化:
           * + 可以用/*no*\/这种注释语法，如：font-size: 12px; /*no*\/
           * + 可以设置 exclude 的，可以把 node_modules 里面的模块 exclude 掉
           */
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // rem相对于px的转换单位。此处表示一个rem代表75px(适合750的视觉稿)
              remPrecesion: 8 // px转成成rem后的小数点位数
            }
          }
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
    }),

    /**
     * 压缩CSS
     */
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g, // 匹配所有的css文件后再有CSS处理器进行压缩
      cssProcessor: require('cssnano') // 预处理器
    }),

    /**
     * 每次构建的时候不会清理目录，造成构建的输出目录output文件越来越多
     *
     * + rm -rf ./dist && webpack --- 不够优雅
     * + clean-webpack-plugin: 默认会删除output指定的输出目录，避免手动删除dist
     */
    new CleanWebpackPlugin(),

    /**
     * 基础库分离
     *
     * 将react、react-dom基础包通过cdn引入，不打入bundle中。
     */
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js', // 对于基础的包，一般是上传到CDN上
          global: 'React'
        },
        {
          module: 'react-dom',
          entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
          global: 'ReactDom'
        }
      ]
    })
  ].concat(htmlWebpackPlugins)
}
