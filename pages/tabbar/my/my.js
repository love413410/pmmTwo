const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js')
const {
  baseSrc,
  myDeta, 
  pass,
  signIn
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    hide: true,
    sign: 0,
    is: false,
    avatar: `${baseSrc}face1.png`,
    nickName: '',
    balance:0,
    vip:'立即成为尊享会员',
    str:'尚未进行企业认证>>'
  },
  onLoad: function(options) {
   
  },
  onShow: function() {
    app.globalData.is = wx.getStorageSync('is') ? true : false;
    if (!app.globalData.is) {
      this.setData({
        is: true,
        hide: true,
        nickName: ''
      })
    } else {
      this.myDeta();
    }
  },
  myDeta(){
    const _this = this;
    _get(myDeta, {
      userid: app.globalData.uid
    }).then(res => {
      const user = res.content.user;
      var vip = user.is_vip == 0 ? '立即成为尊享会员' : user.vip_time+'到期';
      var str = user.is_approve == 0 ? '尚未进行企业认证>>' : user.is_approve == 1 ? '企业认证(审核中)' : user.is_approve == 2 ?'认证企业':'企业认证(未通过,请重新提交)';
      _this.setData({
        nickName: user.nickname,
        avatar: user.avatar,
        hide: false,
        user: user,
        is: false,
        vip: vip,
        str: str,
        balance: user.balance,
        sign: user.is_sign
      })
    })
  },
  signFn(){
    const _this=this;
    _post(signIn, {
      userid: app.globalData.uid
    }).then(res => {
      if (res.code == 1) {
        _this.setData({
          sign:1,
          mask: 1
        })
      } else {
        app.toast(res.msg)
      }
    })
  },
  move(){
    this.setData({
      mask: -1
    })
  },
  popup() {
    this.setData({
      is: true
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
      })
    }
    if (code == 1) {
      this.myDeta();
    }
  },
  rouTo(e) {
    if (app.globalData.is) {
      const url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url: url
      })
    } else {
      this.setData({
        is: true
      })
    }
  },
  renzTo(){
    const n = this.data.user.is_approve;
    var src=n == 0 ? '../../rele/auth/auth' :'../../rele/auth2/auth2';
    wx.navigateTo({
      url: src
    })
  },
  passTo() {
    _get(pass, {
      userid: app.globalData.uid
    }).then(res => {
      if (res.code == 1) {
        wx.navigateTo({
          url: '../../my/setting/setting'
        })
      } else {
        wx.navigateTo({
          url: '../../my/safe/safe'
        })
      }
    })
  },
  onShareAppMessage: function() {

  }
})