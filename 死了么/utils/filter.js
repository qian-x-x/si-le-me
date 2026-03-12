/**
 * 数据过滤/格式化工具
 */

// 格式化时间
const formatTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 手机号脱敏
const maskPhone = (phone) => {
  if (!phone || phone.length !== 11) return phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 截取字符串
const truncate = (str, len = 20) => {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '...' : str
}

// 金额格式化
const formatMoney = (num, decimals = 2) => {
  if (isNaN(num)) return '0.00'
  return Number(num).toFixed(decimals)
}

// 数字千分位
const formatNumber = (num) => {
  if (isNaN(num)) return '0'
  return Number(num).toLocaleString()
}

module.exports = {
  formatTime,
  formatDate,
  maskPhone,
  truncate,
  formatMoney,
  formatNumber
}
