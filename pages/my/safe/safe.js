const app = getApp();
const {
  _get
} = require('../../../utils/http.js')
const {
  baseSrc,
  myDeta,
  pass,
  myAddressList
} = require('../../../utils/urls.js');

Page({
  data: {
    baseSrc: baseSrc,
    avatar: `${baseSrc}face1.png`,
    notRegister:'',
    str: '尚未进行企业认证>>',
    lgt:''
  },
  onLoad: function() {
    const _this = this;
    _get(myDeta, {
      userid: app.globalData.uid
    }).then(res => {
      const user = res.content.user;
      var vip = user.is_vip == 0 ? '立即成为尊享会员' : user.vip_time + '到期';
      var str = user.is_approve == 0 ? '尚未进行企业认证>>' : user.is_approve == 1 ? '企业认证(审核中)' : user.is_approve == 2 ? '认证企业' : '企业认证(未通过,请重新提交)';
      _this.setData({
        nickName: user.nickname,
        avatar: user.avatar,
        hide: false,
        user: user,
        str: str
      })
    });
  },
  onShow:function(){
    this.notRegister();
    this.myAddressList();
  },
  myAddressList(){
    let _this = this;
    _get(myAddressList, {
      userid: app.globalData.uid,
      page:1,
      pagesize:20
    }).then(res => {
      if (res.code == 1) {
        _this.setData({
          lgt: res.content.list.length
        })
      } else {
        app.toast('查询不到您的物流信息!')
      }
    })
  },
  notRegister() {
    let _this = this;
    _get(pass, {
      userid: app.globalData.uid
    }).then(res => {
      if (res.code == 1) {
        _this.setData({
          notRegister: true
        })
      } else {
        _this.setData({
          notRegister: false
        })
      }
    })
  },
  settingPassword() {
    wx.navigateTo({
      url: '../setting/setting',
    })
  },
  changePassword() {
    wx.navigateTo({
      url: '../modify/modify',
    })
  },
  retrievePassword() {
    wx.navigateTo({
      url: '../retrieve/retrieve',
    })
  },
  navTo(e){
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },
  addTo(){
    const lgt = this.data.lgt;
    if(lgt<=0){
      wx.navigateTo({
        url: '../address/address'
      })
    }else{
      wx.navigateTo({
        url: '../myAddress/myAddress'
      })
    }
  },
  out() {
    wx.clearStorage();
    app.globalData.is = wx.getStorageSync('is') ? true : false;
    wx.switchTab({
      url: '../../tabbar/my/my'
    })
  },
})