/**
 * 设置引用这个库的入口文件
 *
 * package.json的main字段为index.js
 */
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/large-number.min.js')
} else {
  module.exports = require('./dist/large-number.js')
}
