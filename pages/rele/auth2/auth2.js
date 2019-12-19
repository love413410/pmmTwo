const app = getApp();
const {
  _get
} = require('../../../utils/http.js')
const {
  myDeta
} = require('../../../utils/urls.js');
Page({
  data: {

  },
  onLoad: function(o) {
    const id = o.id || app.globalData.uid;
    this.myDeta(id); 
  },
  myDeta(id) {
    const _this = this;
    _get(myDeta, {
      userid: id
    }).then(res => {
      const user = res.content.user;
      var picTemp = [];
      picTemp.push(user.business_licence);
      picTemp.push(user.warrant);
      _this.setData({
        user: user,
        picTemp: picTemp
      })
    })
  },
  preview(e) {
    const _this = this;
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: _this.data.picTemp
    })
  },
  to() {
    wx.redirectTo({
      url: '../auth/auth',
    })
  },

  
  onShareAppMessage: function() {

  }
})