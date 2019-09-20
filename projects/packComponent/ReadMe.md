## webpack 打包组件和基础库

webpack 除了可以用来打包应用，也可以用来打包 js 库。

此项目用 webpack 实现一个大整数加法库的打包。

- 需要打包压缩版和非压缩版本；
- 支持 AMD/CJS/ESM 模块引入；

### 一、支持的使用方式

- 支持 ES module

```JS
import * as largeNumber from 'large-number'

//...
largeNumber.add('999','1')
```

- 支持 CJS

```JS
const largeNumber = require('large-number')

//...
largeNumber.add('999','1')
```

- 支持 AMD

```JS
require(['large-number'], function(largeNumber){

  //...
  largeNumber.add('999','1')
})
```

- 可以直接通过 script 引入

```HTML
<script src="https://unpkg.com/large-number"></script>
<script>
  largeNumber.add('999', '1')
</script>
```

### 二、npm 包发布

1. 本地先登录下

> npm login

2. 发布 npm 包

> npm publish
