const app = getApp()
const {
  _get
} = require('../../../utils/http.js')
const {
  passwo
} = require('../../../utils/urls.js');

Page({
  data: {
    password: '',
    isFocus: false,
    inputPwd: true,
  },
  pwd(e) {
    let reg = /[^\d]/g
    let mobile = e.detail.value.replace(reg, '')
    this.setData({
      password: mobile
    })
    return mobile
  },
  getFocus() {
    this.setData({
      isFocus: true
    })
  },
  onLoad: function () {

  },
  submit() {
    let _this = this
    if (_this.data.password.length == 6) {
      _get(passwo, {
        userid: app.globalData.uid,
        password: this.data.password,
      }).then(res => {
        if (res.code == 1) {
          app.toast('旧密码正确')
          wx.redirectTo({
            url: '../setting/setting',
          })
        } else {
          app.toast('旧密码错误')
        }
      })
    }
  },
})