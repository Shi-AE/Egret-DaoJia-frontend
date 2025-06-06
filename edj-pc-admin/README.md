# 白鹭到家-机构端

#### 项目简介

> 当代人们的生活节奏越来越快，很多人因为工作和其他事情没有时间去处理家务事，因此需要家政服务来帮助他们解决日常生活中的问题。白鹭到家家政项目是一种在线服务，将家政服务与互联网技术相结合，为用户提供更加便捷的家政服务。

项目迭代日志：
23年3月30 - 合并更新 处理无法合并问题

#### 研发规范遵循：

- 主体使用驼峰命名
- 公共样式使用 - 连接命名
- 内部样式 驼峰命名
- 页面命名 使用小写开头的驼峰命名
- 组件使用大写开头命名

#### 产品原型及设计

- 设计稿： https://codesign.qq.com/app/design/P4VlZMr6dzjq6wL/board?team_id=6dqN292MdajaBXe
- 产品原型： https://codesign.qq.com/app/prototype/a4Jd0NaP739AMkb/detail

#### 运行环境 - 初始开发环境及工具

- 项目开发环境: win10 + node: v16.19.0 + npm: 8.12.1 || pnpm: 6.32.8

#### 访问地址

#### 技术栈应用

Vue 3 + TypeScript +Tdesign + Vite + pinia

#### 项目结构

```html
├── commitlint.config.js              - commintlint 规范
├── docker                            - docker 部署配置文件
│     └── nginx.conf                  - 若开启 browerhistroy 可参考配置
├── docs                              - 项目展示图 - 首页截图      
├── globals.d.ts                      - 通用声明文件        
├── index.html                        - 主 html 文件
├── mock                              - mock 目录
│     └── index.ts
├── node_modules                      - 项目依赖
├── package-lock.json
├── package.json
├── public                            - 公用资源文件  
│     └── favicon.ico
├── shims-vue.d.ts
├── src                               - 页面代码
│   ├── api 请求相关
│   ├── assets 公共资源
│   │   ├── images 图片资源
│   ├── api                           - 接口
│   ├── components                    - 公用组件
│   │   ├── Delete                    - 删除弹层：只需从父组件传删除的内容提示
│   │   ├── Confirm                   - 确认弹层：只需从父组件传确认的内容提示
│   │   ├── expBall                   - 展示版本更新内容的小球球
│   │   ├── ImageMagnify              - 查看图片弹层
│   │   ├── NoData                    - 无数据的空页面形式
│   │   ├── product-card              - 产品卡片
│   │   ├── result                    - 结果
│   │   ├── editDialog                - 编辑弹窗
│   │   ├── thumbnail                 - 缩略图
│   │   ├── trend                     - 趋势图
│   │   ├── Message                   - 提示弹层
│   │   │   ├──Success                - 成功通知弹窗
│   │   │   ├──ProdDisabled           - 禁用提示弹窗
│   │   ├── switchBar                 - tab切换
│   │   │   ├──switchBar              - tab切换
│   │   │   ├──switchBarindex         - 首页tab切换
│   │   │   ├──switchBartop           - 线条tab
│   ├── czriComponents                - 组件包：常用，但是原有组件库实现不了，因此进行了二次开发
│   │   ├──index.less                 - 组件包样式
│   ├── layouts                       - 页面架构
│   │   ├──components				  - 页面架构公共组件
│   │   │   ├──Breadcrumb			  - 面包屑
│   │   │   ├──Content				  - 内置组件，避免重复渲染DOM
│   │   │   ├──Footer				  - 底部公司名称
│   │   │   ├──LayoutContentSide	  - 侧边栏
│   │   │   ├──LayoutHeader	  		  - 侧边栏头部
│   │   │   ├──Loginfo	  		  	  - 侧边栏退出区域
│   │   │   ├──Notice	  		  	  - 通知中心，弃用
│   │   │   ├──Search	  		  	  - 搜索功能
│   │   ├──simpleComponents		  	  - 框架公用内容
│   │   │   ├──MenuContent	  		  - 简版布局
│   │   │   ├──SideNav	  		  	  - 列表菜单
│   │──index.vue					  - 框架布局
│   │──setting.vue					  = 设置框架风格
│   ├── config                        - 项目配置
│   │   ├──configuration              - 配置项目地址和api
│   │   ├──global                     - 配重全局内容
│   │   ├──proxy.ts                   - 代理样式
│   │   ├──style.ts                   - 配置全局样式风格
│   ├── pages                         - 页面展示目录
│   │   ├──dashboard                  - 首页，工作台
│   │   ├──coupon                     - 优惠券管理页
│   │   │   ├──addCoupon              - 新增，编辑优惠券
│   │   │   ├──index                  - 列表页
│   │   ├──coupon                     - 客户管理页
│   │   ├──default                    - 公共缺省页
│   │   ├──institution                - 企业管理
│   │   │   ├──authentication         - 企业认证管理
│   │   │   ├──information            - 企业信息管理
│   │   ├──personnel                  - 服务人员管理
│   │   │   ├──authentication         - 服务人员认证管理
│   │   │   ├──information            - 服务人员信息管理
│   │   ├──order                      - 订单管理
│   │   │   ├──dispatchList           - 派单列表（已废弃）
│   │   │   ├──historyList            - 历史订单列表
│   │   │   │   ├──orderDetail        - 历史订单详情
│   │   │   │   ├──index              - 列表页
│   │   │   ├──refundList             - 退款订单列表（已废弃）
│   │   │   ├──orderList              - 订单列表
│   │   │   │   ├──orderDetail        - 历史订单详情
│   │   │   │   ├──index              - 列表页
│   │   ├──reply                      - 原评价页面，现修改解决方案，已废弃
│   │   ├──service                    - 服务管理
│   │   │   ├──serviceType            - 服务类型管理
│   │   │   ├──service                - 服务项管理
│   │   │   │   ├──index              - 服务项列表
│   │   │   │   ├──addService         - 新增，编辑服务项
│   │   │   ├──region                 - 区域管理
│   │   │   │   ├──editRegion         - 设置服务
│   │   │   │   ├──index              - 区域列表
│   │   │   │   ├──setBusiness        - 调度配置
│   │   ├──login                      - 登录页
│   │   ├──user                       - 个人中心
│   ├── router                        - 定义路由页面
│   ├── style                         - 样式
│   │   ├──componentsReast            - 组件重置、全局样式
│   │   ├──theme                      - 全局颜色值、公用样式
│   │   index.less                    - 样式总入口
│   │   normal.less                   - 普通框架样式
│   │   noSecondMenu.less             - 普通框架简化版样式
│   │   top.less                      - 上左右布局
│   ├── utils       封装工具目录
│   ├── main.ts						  - 项目入口文件
│   ├── permission.ts				  - 路有权限控制
├── tsconfig.json                     - ts配置文件
├── README.md                         - 说明文档  
└── vite.config.js                    - vite 配置文件
```

#### 安装运行

``` bash
## 安装依赖
npm install || yarn 
##或
cnpm install || yarn 
## 启动项目 

# 启动
npm run dev
# 启动链接测试环境
npm run start

## 构建正式环境 - 打包
npm run build

```

#### 插件

nprogress 进度条

viteMockServe vite 的数据模拟插件

vueJsx
> 使用jsx 语法 jsx语法可以更好地跟Typescript结合 在阅读UI框架源码时，发现在知名UI组件库Ant Design Vue跟Naive UI皆使用tsx语法开发
> vite-svg-loader

#### 参考

vite
vue3
pinia 中文文档 :类vuex
vue-router
Tdesign
Tdesign-cli

tsconfig.json配置

#### 文档

tsconfig.json 配置整理
vite.config.js vite配置文件

src/config/proxy.ts 后端地址配置，

​ release：生成环境下的后端地址，使用npm run build有效 ，

vite.config.ts：配置npm run dev的代理地址	

