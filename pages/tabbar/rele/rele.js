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
    is: false,
    isHide: false,
    mask: 2,
    list: [{
      img: baseSrc + 'rele1.png',
      tle: '终端客户询价',
      sub: '异地商家信息共享或本地直接客户项目咨询',
      url: '../../rele/term/term'
    }, {
      img: baseSrc + 'rele2.png',
      tle: '同行项目外包',
      sub: '异地商家本地安装项目外包询价',
      url: '../../rele/colle/colle'
    }, {
      img: baseSrc + 'rele3.png',
      tle: '全国维修服务',
      sub: '异地商家本地维修屏幕求助',
      url: '../../rele/whole/whole'
    }, {
      img: baseSrc + 'rele4.png',
      tle: '全国求购货源',
      sub: '全国经销商及客户求购信息',
      url: '../../rele/count/count'
    }, {
      img: baseSrc + 'rele5.png',
      tle: '租赁大屏需求',
      sub: '异地商家信息共享或本地直接客户项目咨询',
      url: '../../rele/lease/lease'
    }, {
      img: baseSrc + 'rele6.png',
      tle: '新品促销/尾货处理',
      sub: 'LED显示屏产品优惠促销',
      url: '../../rele/new/new'
    }, {
      img: baseSrc + 'rele7.png',
      tle: '厂家技术预约服务',
      sub: '控制卡厂商技术预约',
      url: '../../rele/fact/fact'
    }]
  },
  onLoad: function(options) {

  },
  toRou(e) {
    const _this = this;
    if (!app.globalData.is) {
      this.setData({
        is: true
      })
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
        success() {
          _this.setData({
            isHide: !_this.data.isHide
          })
        }
      })
    }
  },
  isFn() {
    this.setData({
      isHide: !this.data.isHide
    })
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
      });
    }
  },
  auth() {
    if (!app.globalData.is) {
      this.setData({
        is: true
      })
    } else {
      const _this = this;
      _get(myDeta, {
        userid: app.globalData.uid
      }).then(res => {
        const vip = res.content.user.is_approve;
        var src = vip == 0 ? '../../rele/auth/auth' : '../../rele/auth2/auth2';
        wx.navigateTo({
          url: src
        })
      })
    }
  },
  move() {
    this.setData({
      mask: -1
    })
  },
  toAuth() {
    var src = this.data.isis == 0 ? '../auth/auth' : '../auth2/auth2';
    wx.navigateTo({
      url: src
    })
  },
  onShow: function() {
    
  },
  myDeta() {
    _get(myDeta, {
      userid: app.globalData.uid
    }).then(res => {
      const isis = res.content.user.is_approve;
      var mask = isis == 2 ? mask = -1 : 1;
      this.setData({
        isis: isis,
        mask: mask
      })
    })
  },
  onShareAppMessage: function() {

  }
})