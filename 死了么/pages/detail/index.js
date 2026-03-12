Page({
  data: {
    detail: {
      id: 1,
      title: '示例内容标题',
      desc: '这是一段描述文字',
      image: '/static/image/logo.jpg'
    }
  },

  onLoad(options) {
    if (options.id) {
      this.setData({
        'detail.id': options.id,
        'detail.title': options.title || '示例内容标题',
        'detail.desc': options.desc || '这是一段描述文字'
      })
    }
  }
})
