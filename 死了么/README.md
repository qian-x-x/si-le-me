# 微信小程序快速开发模板

一个开箱即用的微信小程序初始化模板，集成 TDesign 组件库，采用现代优雅的极简主义设计风格。

## 特性

- 彩色弥散背景设计，清新柔和的视觉体验
- 分包优化，按重要性划分主包与子包
- 集成 TDesign 组件库
- 自定义 TabBar
- 完整的基础页面框架

## 目录结构

```
├── custom-tab-bar/          # 自定义底部导航栏
│   ├── index.js
│   ├── index.json
│   ├── index.wxml
│   └── index.wxss
│
├── miniprogram_npm/         # npm 构建目录
│   └── tdesign-miniprogram/ # TDesign 组件库
│
├── pages/                   # 主包页面（重要页面）
│   ├── index/               # 首页
│   ├── discover/            # 发现
│   ├── mine/                # 我的
│   └── detail/              # 内容详情
│
├── subpkg/                  # 分包页面（非核心页面）
│   ├── about/               # 关于我们
│   └── profile/             # 编辑资料
│
├── static/                  # 静态资源
│   └── image/               # 图片资源
│       └── logo.jpg
│
├── utils/                   # 工具函数
│   ├── index.js
│   ├── request.js           # 请求封装
│   ├── storage.js           # 存储封装
│   └── filter.js            # 过滤器
│
├── _reference/              # 参考代码（不参与打包）
│   └── ...                  # TDesign 组件使用示例
│
├── app.js                   # 小程序入口
├── app.json                 # 全局配置
├── app.wxss                 # 全局样式
└── project.config.json      # 项目配置
```

## 开发注意事项
### 底部导航栏 
 默认使用根目录下的custom-tab-bar组件
### 按需引入

不管是接口、公共方法还是组件，都必须按需引入，保证原生微信小程序的开发规范，避免引入未使用的代码。

```javascript
// 正确：按需引入
const { formatTime } = require('../../utils/index.js')

// 错误：全量引入
const utils = require('../../utils/index.js')
```

### 组件使用

优先使用 `miniprogram_npm/tdesign-miniprogram` 目录下的组件，组件使用示例可参考 `_reference` 目录。

```json
{
  "usingComponents": {
    "t-button": "tdesign-miniprogram/button/button",
    "t-icon": "tdesign-miniprogram/icon/icon"
  }
}
```

### 分包规则

- 主包：放置重要页面（TabBar页面、订单、详情等核心业务页面）
- 子包：放置非核心页面（关于我们、设置、帮助等辅助页面）

### 设计规范

- 圆角：24rpx（卡片）、20rpx（小组件）
- 间距：32rpx（页面边距）、24rpx（卡片间距）
- 弥散背景：仅 TabBar 页面使用

### 页面模板

TabBar 页面模板（带弥散背景）：

```html
<view class="gradient-bg">
  <view class="gradient-blob blob-1"></view>
  <view class="gradient-blob blob-2"></view>
  <view class="gradient-blob blob-3"></view>
</view>

<view class="page-container">

  <view class="content">
    <!-- 页面内容 -->
  </view>
</view>
```

普通页面模板：

```html
<view class="page-container">
  
  <view class="content">
    <!-- 页面内容 -->
  </view>
</view>
```

## 开发者

抖音：编程两年半

## 协议

本项目可商用，请遵守相关法律法规。
