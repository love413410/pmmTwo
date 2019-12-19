Page({
  data: {
    url:""
  },
  onLoad: function (o) {
    this.setData({
      url: o.url
    })
  },
  onShareAppMessage: function () {

  }
})