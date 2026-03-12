/**
 * 工具函数统一导出
 * 按需引入示例：
 * const { get, post } = require('../../utils/request')
 * const { formatTime } = require('../../utils/filter')
 * const storage = require('../../utils/storage')
 * 
 * 弹窗类组件直接使用tdesign：
 * - t-toast 轻提示
 * - t-dialog 对话框
 * - t-message 消息通知
 * - t-loading 加载
 */

module.exports = {
  request: require('./request'),
  filter: require('./filter'),
  storage: require('./storage')
}
