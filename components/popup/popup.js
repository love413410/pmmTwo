const app = getApp();
const {
  _get
} = require('../../utils/http.js');
var {
  baseSrc,
  sendSms,
  userExist,
  myDeta
} = require('../../utils/urls.js');
Component({
  properties: {
    hide: {
      type: Boolean,
      value: true
    }
  },
  data: {
    baseSrc: baseSrc,
    hide: false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  ready: function() {
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true
      })
      if (app.globalData.is) {
        this.code();
      }
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          hasUserInfo: true
        })
        if (app.globalData.is) {
          this.code();
        }
      }
    } else {
      wx.getUserInfo({
        success: res => {
          this.setData({
            hasUserInfo: true
          })
        }
      })
    }
  },
  methods: {
    cancel() {
      this.setData({
        hide: false
      })
    },
    getUserInfo: function(e) {
      if (e.detail.errMsg == "getUserInfo:ok") {
        this.code();
        app.globalData.userInfo = e.detail.userInfo;
        this.setData({
          hide: false
        })
      }
    },
    code() {
      const _this = this;
      wx.login({
        success(r) {
          _get(sendSms, {
            code: r.code
          }).then(res => {
            if (res.code == -1) {
              app.toast("获取openId失败")
            } else {
              const openId = res.content.data;
              _get(userExist, {
                openid: openId
              }).then(res => {
                if (res.code == 1) {
                  app.globalData.uid = res.content.uid;
                  wx.setStorageSync('is', 'true');
                  app.globalData.is = wx.getStorageSync('is') ? true : false;
                  const obj = {
                    code: res.code
                  }
                  _get(myDeta, {
                    userid: res.content.uid
                  }).then(res => {
                    const user = res.content.user;
                    const is = user.is_special;
                    if (is==1){
                      wx.reLaunch({
                        url: '../../cartLet/cartLet/cartLet'
                      }) 
                    }else{
                      _this.triggerEvent("popupFn", obj);
                    }
                  })
                } else {
                  const obj = {
                    code: res.code,
                    openId: openId
                  }
                  _this.triggerEvent("popupFn", obj);
                }
              })
            }
          })
        }
      })
    },
  }
})