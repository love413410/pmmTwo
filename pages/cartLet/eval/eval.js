const app = getApp();
const {
  _get
} = require('../../../utils/http.js');
const {
  baseSrc,
  checkDiscuss
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc
  },
  onLoad: function (o) {
    const _this = this;
    _get(checkDiscuss, {
      userid: app.globalData.uid,
      taskid: o.id,
      source: 2
    }).then(res => {
      const data = res.content.detail;
      _this.setData({
        data: data
      })
    })
  },
  onShareAppMessage: function () {

  }
})