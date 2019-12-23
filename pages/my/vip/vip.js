const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js')
const {
  baseSrc,
  myDeta,
  pass,
  passwo,
  vipCall
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    mask: -1,
    payIs: true,
    isFocus: true,
    Value: "",
    is: false
  },
  onLoad: function(options) {
    
  },
  onShow:function(){
    if (!app.globalData.is) {
      this.setData({
        is: true
      })
      return false;
    };
    this.myDeta();
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
      this.myDeta();
    }
  },
  myDeta() {
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
  pay() {
    this.myDeta();
    const is = this.data.user.is_approve;
    if (is != 2) {
      this.setData({
        mask: 1,
        is: is
      })
      return
    } else {
      this.setData({
        payIs: false
      })
    }
  },
  auth() {
    this.setData({
      mask: -1
    })
    const is = this.data.is;
    if (is == 0) {
      wx.navigateTo({
        url: '../../rele/auth/auth'
      });
    } else {
      wx.navigateTo({
        url: '../../rele/auth2/auth2'
      });
    }
  },
  payFn(e) {
    const is = e.detail;
    if (is == 1) {
      const _this = this;
      _post(vipCall, {
        userid: app.globalData.uid,
        payType: 1
      }).then(res => {
        if (res.code == 1) {
          const msg = res.content.data.msg;
          wx.requestPayment({
            timeStamp: msg.timeStamp,
            nonceStr: msg.nonceStr,
            package: msg.package,
            signType: msg.signType,
            paySign: msg.paySign,
            success(res) {
              app.toast('开通成功', 'success');
              _this.myDeta();
            },
          })
        }
      })
    } else if (is == 2) {
      this.setData({
        mask: 2,
        isFocus: true
      })
    } else {
      app.toast('暂未设置支付密码！')
    }
  },
  Focus(e) {
    var _this = this;
    var inputValue = e.detail.value;
    var ilen = inputValue.length;
    this.setData({
      Value: inputValue,
    })
    if (ilen == 6) {
      _get(passwo, {
        userid: app.globalData.uid,
        password: this.data.Value,
      }).then(res => {
        if (res.code == 1) {
          const data = {
            userid: app.globalData.uid,
            type: 2
          };
          _post(vipCall, data).then(res => {
            if (res.code == 1) {
              app.toast(res.msg);
              _this.setData({
                Value: '',
                inputValue: '',
                mask: -1
              })
            }
            app.toast(res.msg)
          })
        } else {
          app.toast(res.msg)
        }
      })
    }
  },
  move() {
    this.setData({
      mask: -1
    })
  },
  onShareAppMessage: function() {

  }
})