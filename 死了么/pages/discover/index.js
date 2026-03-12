const { location } = require('../../utils/request')

Page({
  data: {
    latitude: 39.9042,
    longitude: 116.4074,
    scale: 14,
    markers: [],
    nearbyCount: 0,
    signedCount: 0,
    unsignedCount: 0
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setActive(1)
    }
    this.loadMapData()
  },

  loadMapData() {
    wx.showLoading({ title: '加载中...' })

    // 先获取当前位置
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })

        // 上报位置
        location.report(res.latitude, res.longitude, res.accuracy).then(() => {
          console.log('位置上报成功')
        }).catch(err => {
          console.error('位置上报失败', err)
        })

        // 获取附近用户
        this.fetchNearbyUsers(res.latitude, res.longitude)
      },
      fail: () => {
        wx.hideLoading()
        // 获取位置失败，使用默认位置
        this.fetchNearbyUsers(this.data.latitude, this.data.longitude)
      }
    })
  },

  fetchNearbyUsers(latitude, longitude) {
    location.getNearby(latitude, longitude, 5000).then(data => {
      wx.hideLoading()

      const users = data.users || []
      const signedCount = users.filter(u => u.signedInToday).length
      const unsignedCount = users.length - signedCount

      const markers = users.map(user => ({
        id: user.id,
        latitude: user.latitude,
        longitude: user.longitude,
        width: 36,
        height: 36,
        iconPath: '/static/image/logo.jpg',
        callout: {
          content: user.signedInToday ? '今天存活' : '不知去向',
          color: user.signedInToday ? '#34c759' : '#ff3b30',
          fontSize: 11,
          borderRadius: 4,
          bgColor: user.signedInToday ? '#e8f5e9' : '#ffebee',
          padding: 3,
          display: 'ALWAYS'
        }
      }))

      this.setData({
        markers,
        nearbyCount: data.nearbyCount || users.length,
        signedCount,
        unsignedCount
      })
    }).catch(err => {
      wx.hideLoading()
      console.error('获取附近用户失败', err)

      // 失败时使用本地模拟数据
      const mockUsers = [
        { id: 1, name: '用户A', latitude: 39.9042, longitude: 116.4074, signedInToday: true },
        { id: 2, name: '用户B', latitude: 39.9062, longitude: 116.4094, signedInToday: true },
        { id: 3, name: '用户C', latitude: 39.9022, longitude: 116.4054, signedInToday: false },
        { id: 4, name: '用户D', latitude: 39.9082, longitude: 116.4114, signedInToday: true },
        { id: 5, name: '用户E', latitude: 39.9002, longitude: 116.4034, signedInToday: false },
        { id: 6, name: '用户F', latitude: 39.9072, longitude: 116.4084, signedInToday: true },
        { id: 7, name: '用户G', latitude: 39.9012, longitude: 116.4044, signedInToday: true },
        { id: 8, name: '用户H', latitude: 39.9092, longitude: 116.4124, signedInToday: false },
        { id: 9, name: '用户I', latitude: 39.9032, longitude: 116.4064, signedInToday: true },
        { id: 10, name: '用户J', latitude: 39.9052, longitude: 116.4084, signedInToday: true },
        { id: 11, name: '用户K', latitude: 39.9072, longitude: 116.4104, signedInToday: false },
        { id: 12, name: '用户L', latitude: 39.9022, longitude: 116.4024, signedInToday: true },
        { id: 13, name: '用户M', latitude: 39.9042, longitude: 116.4124, signedInToday: true },
        { id: 14, name: '用户N', latitude: 39.9082, longitude: 116.4054, signedInToday: false },
        { id: 15, name: '用户O', latitude: 39.9002, longitude: 116.4084, signedInToday: true },
        { id: 16, name: '用户P', latitude: 39.9062, longitude: 116.4024, signedInToday: true },
        { id: 17, name: '用户Q', latitude: 39.9032, longitude: 116.4114, signedInToday: false },
        { id: 18, name: '用户R', latitude: 39.9052, longitude: 116.4044, signedInToday: true },
        { id: 19, name: '用户S', latitude: 39.9072, longitude: 116.4064, signedInToday: true },
        { id: 20, name: '用户T', latitude: 39.9012, longitude: 116.4104, signedInToday: false },
        { id: 21, name: '用户U', latitude: 39.9042, longitude: 116.4034, signedInToday: true },
        { id: 22, name: '用户V', latitude: 39.9082, longitude: 116.4094, signedInToday: true },
        { id: 23, name: '用户W', latitude: 39.9022, longitude: 116.4074, signedInToday: false },
        { id: 24, name: '用户X', latitude: 39.9062, longitude: 116.4114, signedInToday: true },
        { id: 25, name: '用户Y', latitude: 39.9002, longitude: 116.4054, signedInToday: true }
      ]

      const signedCount = mockUsers.filter(u => u.signedInToday).length
      const unsignedCount = mockUsers.length - signedCount

      const markers = mockUsers.map(user => ({
        id: user.id,
        latitude: user.latitude,
        longitude: user.longitude,
        width: 36,
        height: 36,
        iconPath: '/static/image/logo.jpg',
        callout: {
          content: user.signedInToday ? '今天存活' : '不知去向',
          color: user.signedInToday ? '#34c759' : '#ff3b30',
          fontSize: 11,
          borderRadius: 4,
          bgColor: user.signedInToday ? '#e8f5e9' : '#ffebee',
          padding: 3,
          display: 'ALWAYS'
        }
      }))

      this.setData({
        markers,
        nearbyCount: mockUsers.length,
        signedCount,
        unsignedCount
      })
    })
  },

  onTapMarker(e) {
    const markerId = e.detail.markerId
    const marker = this.data.markers.find(m => m.id === markerId)
    if (marker) {
      wx.showToast({
        title: marker.callout.content,
        icon: 'none'
      })
    }
  }
})
