const {
  baseSrc
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc
  },
  onLoad: function (options) {
    this.setData({
      is: options.is
    })
  },
  onShareAppMessage: function () {

  }
})