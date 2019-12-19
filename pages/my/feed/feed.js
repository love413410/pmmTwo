const {
  baseSrc
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc
  },
  onLoad: function (o) {
    this.setData({
      t:o.t
    })
  },
  rouTo(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },
  onShareAppMessage: function () {

  }
})