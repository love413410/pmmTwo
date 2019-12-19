const app = getApp();
const {
  _post
} = require('../../../utils/http.js');
const {
  baseSrc,
  discuss
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    isTrue: 1,
    val: ""
  },
  onLoad: function(o) {
    this.setData({
      id: o.id
    })
  },
  isFn(e) {
    const is = e.currentTarget.dataset.is;
    this.setData({
      isTrue: is
    })
  },
  iptFn(e) {
    this.setData({
      val: e.detail.value
    })
  },
  subFn() {
    const _this=this;
    _post(discuss, {
      userid: app.globalData.uid,
      type: this.data.isTrue,
      id: this.data.id,
      source: 2,
      content: this.data.val
    }).then(res => {
      app.toast(res.msg);
      setTimeout(_this.back, 1000)
    })
  },
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  onShareAppMessage: function() {

  }
})