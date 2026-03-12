const { signin } = require('../../utils/request')

Page({
  data: {
    isAlive: true,
    lastSignIn: null,
    lastSignInText: '',
    consecutiveDays: 0,
    totalDays: 0,
    longestStreak: 0,
    daysSinceSignIn: 0,
    showWarning: false,
    canSignIn: true
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setActive(0)
    }
    this.loadSignInData()
  },

  loadSignInData() {
    wx.showLoading({ title: '加载中...' })

    signin.getStatus().then(data => {
      wx.hideLoading()

      const now = Date.now()
      let daysSinceSignIn = 0
      let showWarning = false

      if (data.lastSignInTime) {
        const oneDay = 24 * 60 * 60 * 1000
        const lastSignInTime = new Date(data.lastSignInTime).getTime()
        daysSinceSignIn = Math.floor((now - lastSignInTime) / oneDay)

        // 超过2天未签到显示警告
        if (daysSinceSignIn >= 2) {
          showWarning = true
        }
      }

      // 格式化上次签到时间
      let lastSignInText = '尚未签到'
      if (data.lastSignInTime) {
        const date = new Date(data.lastSignInTime)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (date.toDateString() === today.toDateString()) {
          lastSignInText = '今天'
        } else if (date.toDateString() === yesterday.toDateString()) {
          lastSignInText = '昨天'
        } else {
          lastSignInText = daysSinceSignIn + '天前'
        }
      }

      this.setData({
        lastSignIn: data.lastSignInTime,
        lastSignInText,
        consecutiveDays: data.consecutiveDays || 0,
        totalDays: data.totalDays || 0,
        longestStreak: data.longestStreak || 0,
        daysSinceSignIn,
        showWarning,
        canSignIn: !data.isSignedToday
      })
    }).catch(err => {
      wx.hideLoading()
      console.error('获取签到状态失败', err)

      // 失败时使用本地缓存数据
      const signInData = wx.getStorageSync('signInData') || {
        lastSignIn: null,
        consecutiveDays: 0,
        totalDays: 0,
        longestStreak: 0,
        signInHistory: []
      }

      const now = Date.now()
      let daysSinceSignIn = 0
      let showWarning = false

      if (signInData.lastSignIn) {
        const oneDay = 24 * 60 * 60 * 1000
        daysSinceSignIn = Math.floor((now - signInData.lastSignIn) / oneDay)

        if (daysSinceSignIn >= 2) {
          showWarning = true
        }
      }

      let canSignIn = true
      if (signInData.lastSignIn) {
        const today = new Date()
        const lastSignInDate = new Date(signInData.lastSignIn)
        if (today.toDateString() === lastSignInDate.toDateString()) {
          canSignIn = false
        }
      }

      let lastSignInText = '尚未签到'
      if (signInData.lastSignIn) {
        const date = new Date(signInData.lastSignIn)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (date.toDateString() === today.toDateString()) {
          lastSignInText = '今天'
        } else if (date.toDateString() === yesterday.toDateString()) {
          lastSignInText = '昨天'
        } else {
          lastSignInText = daysSinceSignIn + '天前'
        }
      }

      this.setData({
        lastSignIn: signInData.lastSignIn,
        lastSignInText,
        consecutiveDays: signInData.consecutiveDays || 0,
        totalDays: signInData.totalDays || 0,
        longestStreak: signInData.longestStreak || 0,
        daysSinceSignIn,
        showWarning,
        canSignIn
      })
    })
  },

  doSignIn() {
    if (!this.data.canSignIn) return

    wx.showLoading({ title: '签到中...' })

    signin.daily().then(data => {
      wx.hideLoading()

      wx.showToast({
        title: '签到成功',
        icon: 'success'
      })

      // 签到成功后更新本地存储
      const signInData = {
        lastSignIn: data.signinTime,
        consecutiveDays: data.consecutiveDays,
        totalDays: data.totalDays,
        longestStreak: data.longestStreak,
        signInHistory: [
          { time: data.signinTime, consecutiveDays: data.consecutiveDays },
          ...(wx.getStorageSync('signInData')?.signInHistory || []).slice(0, 29)
        ]
      }
      wx.setStorageSync('signInData', signInData)

      this.loadSignInData()
    }).catch(err => {
      wx.hideLoading()
      console.error('签到失败', err)

      // 失败时使用本地逻辑
      const now = Date.now()
      const signInData = wx.getStorageSync('signInData') || {
        lastSignIn: null,
        consecutiveDays: 0,
        totalDays: 0,
        longestStreak: 0,
        signInHistory: []
      }

      let consecutiveDays = 1
      if (signInData.lastSignIn) {
        const oneDay = 24 * 60 * 60 * 1000
        const daysSinceLastSignIn = Math.floor((now - signInData.lastSignIn) / oneDay)

        if (daysSinceLastSignIn === 1) {
          consecutiveDays = signInData.consecutiveDays + 1
        } else if (daysSinceLastSignIn === 0) {
          wx.showToast({
            title: '今天已签到',
            icon: 'none'
          })
          return
        }
      }

      const newSignInData = {
        lastSignIn: now,
        consecutiveDays,
        totalDays: signInData.totalDays + 1,
        longestStreak: Math.max(signInData.longestStreak, consecutiveDays),
        signInHistory: [
          { time: now, consecutiveDays },
          ...signInData.signInHistory.slice(0, 29)
        ]
      }

      wx.setStorageSync('signInData', newSignInData)

      wx.showToast({
        title: '签到成功',
        icon: 'success'
      })

      this.loadSignInData()
    })
  }
})
