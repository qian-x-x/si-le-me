/**
 * 本地存储封装
 */
const set = (key, value) => {
  try {
    wx.setStorageSync(key, value)
    return true
  } catch (e) {
    return false
  }
}

const get = (key, defaultValue = null) => {
  try {
    const value = wx.getStorageSync(key)
    return value !== '' ? value : defaultValue
  } catch (e) {
    return defaultValue
  }
}

const remove = (key) => {
  try {
    wx.removeStorageSync(key)
    return true
  } catch (e) {
    return false
  }
}

const clear = () => {
  try {
    wx.clearStorageSync()
    return true
  } catch (e) {
    return false
  }
}

module.exports = {
  set,
  get,
  remove,
  clear
}
