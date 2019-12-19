const app = getApp();
const {
  _get
} = require('../../../utils/http.js')
const {
  version
} = require('../../../utils/urls.js');
Page({
  data: {
    edition:''
  },
  onLoad: function () {
    const _this = this;
    _get(version).then(res => {
      _this.setData({
        edition: res.content.list
      })
    })
  },
  onShareAppMessage: function () {

  }
})