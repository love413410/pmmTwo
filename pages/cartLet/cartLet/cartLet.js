const app = getApp();
const {
  _get
} = require('../../../utils/http.js')
const {
  baseSrc,
  myDeta
} = require('../../../utils/urls.js');
Page({
  data: { 
    baseSrc: baseSrc,
    avatar: `${baseSrc}face1.png`,
    num: 0,
    img: false,
    align:'center'
  },
  onLoad: function(o) {
    var res = wx.getSystemInfoSync();
    var is = res.system.indexOf('iOS');
    if(is>-1){
      this.setData({
        align: 'center'
      })
    }else{
      this.setData({
        align: 'left'
      })
    }
  },
  showFn() {
    this.setData({
      img: !this.data.img
    })
  },
  onShow: function() {
    const _this = this;
    _get(myDeta, {
      userid: app.globalData.uid
    }).then(res => {
      const user = res.content.user;
      _this.setData({
        user: user
      })
    })
  },
  navToFn(e){
    const url = e.currentTarget.dataset.url;
    this.setData({
      img: false
    })
    wx.navigateTo({
      url: url
    })
  },  
  onShareAppMessage: function() {

  }
})