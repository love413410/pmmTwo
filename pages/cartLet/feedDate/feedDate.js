const app = getApp();
const {
  _get
} = require('../../../utils/http.js')
const {
  checkFeedback
} = require('../../../utils/urls.js');
Page({
  data: {
    buserid:''
  },
  onLoad: function (options) {
    this.setData({
      id: options.id,
      source: options.source
    });
    if (options.source==2){
      this.setData({
        buserid: options.buserid
      });
    };
    this.list();
  },
  list() {
    const _this = this;
    _get(checkFeedback, {
      userid: app.globalData.uid,
      taskid:this.data.id,
      source: this.data.source,
      buserid: this.data.buserid
    }).then(res => {
      if(res.code=1){
        const data = res.content.detail;
        _this.setData({
          data: data,
          picArr: [...data.pics, ...data.warrant]
        })
      }
    })
  },
  preview(e) {
    const _this = this;
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: _this.data.picArr
    })
  },
  onShareAppMessage: function () {

  }
})