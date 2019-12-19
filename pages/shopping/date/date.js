const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js');
const {
  baseSrc,
  good,
  exchange,
  myDeta,
  myAddressList
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    dateVal:''
  },
  onLoad: function(o) {
    this.good(o.id);
  },
  good(id) {
    _get(good, {
      goodid: id
    }).then(res => {
      const val = this.replFn(res.content.good.des);
      this.setData({
        good: res.content.good,
        dateVal: val
      })
    })
  },
  replFn(str) {
    str = str.replace(/&#039;/g, '"');
    str = str.replace(/&lt;/g, '<');
    str = str.replace(/&gt;/g, '>');
    return str;
  },
  excFn() {
    const id = this.data.good.id;
    const _this = this;
    _get(myDeta, {
      userid: app.globalData.uid
    }).then(res => {
      const vip = res.content.user.is_vip == 1 ? true : false;
      if (vip!=1) {
        this.setData({
          mask: 2
        })
        return;
      }else{
        _get(myAddressList, {
          userid: app.globalData.uid,
          page: 1,
          pagesize: 20
        }).then(res => {
          if (res.code == 1) {
            const lgt = res.content.list.length;
            if (lgt <= 0) {
              wx.navigateTo({
                url: '../../my/address/address?i=1'
              })
            } else {
              wx.navigateTo({
                url: '../../my/myAddress2/myAddress?id=' + id
              })
            }
          } else {
            app.toast('查询不到您的物流信息!')
          }
        })
      }
    })
  },
  
  move(e) {
    const x = e.currentTarget.dataset.x;
    this.setData({
      mask: x
    })
  },
  rouTo(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },

  onShareAppMessage: function() {

  }
})