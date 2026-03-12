const { auth } = require('./utils/request')

App({
  onLaunch() {
    console.log('App Launch')
    this.login()
  },

  onShow() {
    console.log('App Show')
  },

  onHide() {
    console.log('App Hide')
  },

  // 登录流程
  login() {
    // 检查是否已有token
    const token = wx.getStorageSync('token')
    if (token) {
      console.log('已存在token，跳过登录')
      return
    }

    // 调用微信登录接口
    wx.login({
      success: (res) => {
        if (res.code) {
          console.log('微信登录code:', res.code)
          // 调用后端登录接口
          auth.login(res.code).then(data => {
            console.log('登录成功', data)
            // 存储token
            wx.setStorageSync('token', data.token)
            // 存储用户信息
            if (data.userId) {
              wx.setStorageSync('userId', data.userId)
            }
          }).catch(err => {
            console.error('登录失败', err)
          })
        } else {
          console.error('wx.login失败', res)
        }
      },
      fail: (err) => {
        console.error('wx.login调用失败', err)
      }
    })
  }
})
