const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js');
const {
  baseSrc,
  shop,
  exchange,
  myDeta,
  myAddressList
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    is: false,
    page: 1,
    pagesize: 20,
    list: [],
    score: 0,
    vip: false
  },
  onLoad: function(options) {

  },
  shop() {
    _get(shop, {
      page: this.data.page,
      pagesize: this.data.pagesize
    }).then(res => {
      const list = res.content.list;
      this.setData({
        list: [...this.data.list, ...list]
      })
    })
  },
  excFn(e) {
    app.globalData.is = wx.getStorageSync('is') ? true : false;
    if (!app.globalData.is) {
      this.setData({
        is: true
      })
      return false;
    }
    const _this = this;
    _get(myDeta, {
      userid: app.globalData.uid
    }).then(res => {
      const mask = res.content.user.is_vip == 1 ? -1 : 2;
      const score = res.content.user.score;
      _this.setData({
        mask: mask,
        score: score
      });
      if (res.content.user.is_vip == 1) {
        _get(myAddressList, {
          userid: app.globalData.uid,
          page: 1,
          pagesize: 20
        }).then(res => {
          if (res.code == 1) {
            const id = e.currentTarget.dataset.id;
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
    app.globalData.is = wx.getStorageSync('is') ? true : false;
    if (!app.globalData.is) {
      this.setData({
        is: true
      })
      return
    } else {
      this.setData({
        is: false
      });
    };
    const url = e.currentTarget.dataset.url;
    const id = e.currentTarget.dataset.id;
    var src;
    
    if (id) {
      src = `${url}?id=${id}`;
    } else {
      src = url
    }
    wx.navigateTo({
      url: src
    })
  },
  onShow: function() {
    this.setData({
      page: 1,
      list: []
    });
    this.shop();
    app.globalData.is = wx.getStorageSync('is') ? true : false;
    if (app.globalData.is) {
      this.myDeta()
    }
  },
  popupFn(e) {
    const code = e.detail.code;
    if (code == -1) {
      app.toast("获取用户信息失败")
    } else if (code == 0) {
      const openId = e.detail.openId;
      app.globalData.openId = openId;
      wx.navigateTo({
        url: '../../login/login'
      })
    } else {
      this.myDeta()
    }
  },
  myDeta() {
    const _this = this;
    _get(myDeta, {
      userid: app.globalData.uid
    }).then(res => {
      const vip = res.content.user.is_vip == 1 ? true : false;
      const score = res.content.user.score;
      _this.setData({
        vip: vip,
        score: score,
        is: false
      });
    })
  },
  onReachBottom: function() {
    const page = this.data.page;
    this.setData({
      page: page + 1
    })
    this.shop();
  },
  onShareAppMessage: function() {

  }
})