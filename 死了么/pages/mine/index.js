const { user, emergency, signin } = require('../../utils/request')

Page({
  data: {
    avatar: '/static/image/logo.jpg',
    username: '用户',
    uid: '',
    totalDays: 0,
    consecutiveDays: 0,
    longestStreak: 0,
    emergencyContact: null,
    signInHistory: []
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setActive(3)
    }
    this.loadUserData()
  },

  loadUserData() {
    wx.showLoading({ title: '加载中...' })

    // 并行请求用户信息和紧急联系人
    Promise.all([
      user.getInfo(),
      emergency.get(),
      signin.getHistory(1, 30)
    ]).then(([userInfo, emergencyContact, historyData]) => {
      wx.hideLoading()

      this.setData({
        avatar: userInfo.avatar || '/static/image/logo.jpg',
        username: userInfo.nickname || '用户',
        uid: 'UID' + userInfo.id,
        totalDays: userInfo.totalDays || 0,
        consecutiveDays: userInfo.consecutiveDays || 0,
        longestStreak: userInfo.longestStreak || 0,
        emergencyContact: emergencyContact,
        signInHistory: historyData || []
      })
    }).catch(err => {
      wx.hideLoading()
      console.error('获取用户信息失败', err)

      // 失败时使用本地缓存数据
      const userInfo = wx.getStorageSync('userInfo') || {}
      const username = userInfo.nickname || '用户'
      const uid = userInfo.uid || this.generateUid()

      const signInData = wx.getStorageSync('signInData') || {}
      const emergencyContact = wx.getStorageSync('emergencyContact') || null
      const signInHistory = signInData.signInHistory || []

      this.setData({
        username,
        uid,
        totalDays: signInData.totalDays || 0,
        consecutiveDays: signInData.consecutiveDays || 0,
        longestStreak: signInData.longestStreak || 0,
        emergencyContact,
        signInHistory
      })
    })
  },

  generateUid() {
    const uid = 'UID' + Date.now().toString().slice(-6)
    const userInfo = wx.getStorageSync('userInfo') || {}
    userInfo.uid = uid
    wx.setStorageSync('userInfo', userInfo)
    return uid
  },

  goEmergencyContact() {
    wx.navigateTo({ url: '/subpkg/emergency/index' })
  },

  goSignInHistory() {
    wx.showLoading({ title: '加载中...' })

    signin.getHistory(1, 50).then(data => {
      wx.hideLoading()

      const historyText = this.formatSignInHistory(data || [])
      wx.showModal({
        title: '签到历史',
        content: historyText,
        showCancel: false
      })
    }).catch(err => {
      wx.hideLoading()
      console.error('获取签到历史失败', err)

      // 失败时使用本地数据
      const historyText = this.getSignInHistoryText()
      wx.showModal({
        title: '签到历史',
        content: historyText,
        showCancel: false
      })
    })
  },

  formatSignInHistory(history) {
    if (!history || history.length === 0) {
      return '暂无签到记录'
    }

    const text = history.slice(0, 20).map((item, index) => {
      const date = new Date(item.time)
      return `${index + 1}. ${date.getMonth() + 1}-${date.getDate()} 连续${item.consecutiveDays}天`
    })

    return text.join('\n')
  },

  getSignInHistoryText() {
    if (this.data.signInHistory.length === 0) {
      return '暂无签到记录'
    }

    const history = this.data.signInHistory.slice(0, 10).map((item, index) => {
      const date = new Date(item.time)
      return `${index + 1}. ${date.getMonth() + 1}-${date.getDate()} 连续${item.consecutiveDays}天`
    })
    return history.join('\n')
  }
})
