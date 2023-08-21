# 韩师SpringBoot期末作业（03卢兆锋）



- 打开终端/控制台，输入npm install进行编译，编译结束后输入npm run dev启动项目即可访问

以下是涉及到开发的文件夹

- .env.development 在这个环境文件中修改你的后端请求路径
- scr/api/ 放置后端接口js文件，建议一个模块一个js
- src/router/index.js 路由文件，新建一模块后需要在这个js里面新增配置，页面才能显示出来
- src/views/ 放置vue页面文件，建议一个模块一个文件夹然后再在里面建一个index.vue，开发时候可以拷贝views/book/index.vue进行修改，这个页面功能比较全面
- 其他文件可以不关注，都是些配置项相关（我也不太会）
- 开发顺序是1.修改后端请求路径 2.新建一个模块的vue页面并按需修改 3.新建一个后端接口js文件 4.对接接口到页面中 5.测试

下面是原项目文档

# vue-admin-template

> 这是一个极简的 vue admin 管理后台。它只包含了 Element UI & axios & iconfont & permission control & lint，这些搭建后台必要的东西。

[线上地址](http://panjiachen.github.io/vue-admin-template)

[国内访问](https://panjiachen.gitee.io/vue-admin-template)

## Build Setup

```bash
# 克隆项目
git clone https://github.com/PanJiaChen/vue-admin-template.git

# 进入项目目录
cd vue-admin-template

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:9528](http://localhost:9528)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

更多信息请参考 [使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/)

## License

[MIT](https://github.com/PanJiaChen/vue-admin-template/blob/master/LICENSE) license.

Copyright (c) 2017-present PanJiaChen
