/**
 * 网络请求封装
 */
const BASE_URL = 'http://10.66.46.139:3000'

/**
 * 获取token
 */
const getToken = () => {
  return wx.getStorageSync('token') || ''
}

/**
 * 通用请求方法
 */
const request = (options) => {
  const token = getToken()

  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const data = res.data
          if (data.code === 0) {
            resolve(data.data)
          } else {
            wx.showToast({
              title: data.message || '请求失败',
              icon: 'none'
            })
            reject(data)
          }
        } else if (res.statusCode === 401) {
          wx.showToast({
            title: '请先登录',
            icon: 'none'
          })
          reject(res)
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          })
          reject(res)
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

/**
 * GET请求
 */
const get = (url, data) => request({ url, method: 'GET', data })

/**
 * POST请求
 */
const post = (url, data) => request({ url, method: 'POST', data })

// ==================== API模块 ====================

/**
 * 认证模块
 */
const auth = {
  /**
   * 微信登录
   * @param {string} code 微信登录code
   */
  login(code) {
    return post('/api/auth/login', { code })
  }
}

/**
 * 用户模块
 */
const user = {
  /**
   * 获取用户信息
   */
  getInfo() {
    return get('/api/user/info')
  },

  /**
   * 更新用户资料
   * @param {Object} data {nickname, avatar, bio}
   */
  updateProfile(data) {
    return post('/api/user/profile', data)
  },

  /**
   * 绑定手机号
   * @param {string} phone 手机号
   * @param {string} code 短信验证码
   */
  bindPhone(phone, code) {
    return post('/api/user/bind-phone', { phone, code })
  }
}

/**
 * 签到模块
 */
const signin = {
  /**
   * 每日签到
   */
  daily() {
    return post('/api/signin/daily')
  },

  /**
   * 获取签到状态
   */
  getStatus() {
    return get('/api/signin/status')
  },

  /**
   * 获取签到历史
   * @param {number} page 页码
   * @param {number} pageSize 每页数量
   */
  getHistory(page = 1, pageSize = 30) {
    return get('/api/signin/history', { page, pageSize })
  }
}

/**
 * 排行榜模块
 */
const rank = {
  /**
   * 获取排行榜
   * @param {string} type 排行榜类型：consecutive/total
   * @param {number} page 页码
   * @param {number} pageSize 每页数量
   */
  getList(type = 'consecutive', page = 1, pageSize = 10) {
    return get('/api/rank/list', { type, page, pageSize })
  }
}

/**
 * 位置模块
 */
const location = {
  /**
   * 上报位置
   * @param {number} latitude 纬度
   * @param {number} longitude 经度
   * @param {number} accuracy 定位精度
   */
  report(latitude, longitude, accuracy) {
    return post('/api/location/report', { latitude, longitude, accuracy })
  },

  /**
   * 获取附近用户
   * @param {number} latitude 纬度
   * @param {number} longitude 经度
   * @param {number} radius 半径（米）
   */
  getNearby(latitude, longitude, radius = 5000) {
    return get('/api/location/nearby', { latitude, longitude, radius })
  }
}

/**
 * 紧急联系人模块
 */
const emergency = {
  /**
   * 获取紧急联系人
   */
  get() {
    return get('/api/emergency/get')
  },

  /**
   * 保存紧急联系人
   * @param {Object} data {name, phone, email}
   */
  save(data) {
    return post('/api/emergency/save', data)
  }
}

module.exports = {
  request,
  get,
  post,
  auth,
  user,
  signin,
  rank,
  location,
  emergency
}
