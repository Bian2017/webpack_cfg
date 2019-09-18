/**
 * eslint配置文件
 */

module.exports = {
  // ESLint 默认使用Espree作为其解析器。因为我们代码中可能会用到一些实验性的语言特性，因此我们在 parserOptions 中指定 babel-eslint 作为解析器
  parser: 'babel-eslint',
  // env 用来指定我们代码的运行环境，并将运行环境中的预置的全局变量导入
  env: {
    browser: true,
    node: true,
    es6: true
  },
  // 通过extends继承一些规则配置。
  // 使用eslint-config-airbnb 规则需安装第三方依赖：eslint-plugin-import、eslint-plugin-jsx-a11y、eslint-plugin-react
  extends: ['airbnb', 'prettier'],
  // 脚本在执行期间访问的额外的全局变量，这样直接使用不会报错
  globals: {
    chrome: true
  },
  /**
   * 规则等级有三种：
   * “off”或者0： 关闭规则
   * “warn”或者1： 打开规则，作为警告。
   * “error”或者2： 打开规则，作为错误
   */
  rules: {
    // 多行的 jsx 必须有括号包起来。
    // 关闭该规则。没必要限制
    'react/jsx-wrap-multilines': 0,
    // 关闭airbnb对于必须添加prop-types的校验
    'react/prop-types': 0,
    // 外部作用域中的变量不能与它所包含的作用域中的变量或参数同名。
    // 关闭该规则，因为使用react-redux中connect进行mapDispatchToProps时，对解构出的action会报错
    'no-shadow': 0,
    // 关闭要求一个表达式必须换行的要求，和Prettier冲突了
    'react/jsx-one-expression-per-line': 'off',
    'import/no-unresolved': [
      2,
      {
        ignore: ['^@/', '^@cfg/'] // 解决eslint不能识别webpack的路径别名
      }
    ],
    // 允许定义点击事件的时候不加上onKeyDown、onKeyUp等来区分
    'jsx-a11y/click-events-have-key-events': 0,
    // 允许非交互性组件增加事件
    'jsx-a11y/no-noninteractive-element-interactions': 0, // 允许非交互性组件增加事件
    // 非交互元素不应该有鼠标或键盘事件监听器
    // 关闭此规则。允许非常用的节点可以监听鼠标或键盘事件
    'jsx-a11y/no-static-element-interactions': 0,
    // 当很多人协同开发时，会用到不同的编辑器。不同编辑器在不同的操作系统换行符不一样。
    // 关闭强制使用一致的换行符风格
    'linebreak-style': 0
  }
}
