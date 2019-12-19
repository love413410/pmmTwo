Page({
  data: {
    task:{}
  },
  onLoad: function (options) {
    var tende = wx.getStorageSync('tende');
    this.setData({
      task: tende
    })
  },
  onUnload: function () {
    wx.removeStorageSync('tende');
  },
  onShareAppMessage: function () {

  }
})