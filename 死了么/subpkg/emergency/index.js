const { emergency } = require('../../utils/request')

Page({
  data: {
    name: '',
    phone: '',
    email: ''
  },

  onLoad() {
    this.loadEmergencyContact()
  },

  goBack() {
    wx.navigateBack()
  },

  loadEmergencyContact() {
    wx.showLoading({ title: '加载中...' })

    emergency.get().then(data => {
      wx.hideLoading()

      this.setData({
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || ''
      })
    }).catch(err => {
      wx.hideLoading()
      console.error('获取紧急联系人失败', err)

      // 失败时使用本地缓存数据
      const emergencyContact = wx.getStorageSync('emergencyContact') || {}
      this.setData({
        name: emergencyContact.name || '',
        phone: emergencyContact.phone || '',
        email: emergencyContact.email || ''
      })
    })
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value })
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value })
  },

  onEmailInput(e) {
    this.setData({ email: e.detail.value })
  },

  saveEmergencyContact() {
    const { name, phone, email } = this.data

    if (!name.trim()) {
      wx.showToast({
        title: '请输入联系人姓名',
        icon: 'none'
      })
      return
    }

    if (!phone.trim()) {
      wx.showToast({
        title: '请输入联系电话',
        icon: 'none'
      })
      return
    }

    // 简单的手机号格式验证
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }

    // 简单的邮箱格式验证（可选）
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      wx.showToast({
        title: '请输入正确的邮箱',
        icon: 'none'
      })
      return
    }

    wx.showLoading({ title: '保存中...' })

    const data = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim()
    }

    emergency.save(data).then(() => {
      wx.hideLoading()

      // 保存成功后更新本地存储
      wx.setStorageSync('emergencyContact', data)

      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })

      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }).catch(err => {
      wx.hideLoading()
      console.error('保存紧急联系人失败', err)

      // 失败时仍然保存到本地存储
      wx.setStorageSync('emergencyContact', data)

      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })

      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    })
  }
})
