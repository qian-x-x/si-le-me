Component({
  data: {
    active: 0,
    list: [
      { icon: 'home', text: '首页', pagePath: '/pages/index/index' },
      { icon: 'location', text: '地图', pagePath: '/pages/discover/index' },
      { icon: 'gift', text: '排行', pagePath: '/pages/rank/index' },
      { icon: 'user', text: '我的', pagePath: '/pages/mine/index' }
    ]
  },

  methods: {
    onChange(e) {
      const index = e.detail.value
      if (index === this.data.active) return
      const path = this.data.list[index].pagePath
      wx.switchTab({ url: path })
    },

    setActive(index) {
      this.setData({ active: index })
    }
  }
})
