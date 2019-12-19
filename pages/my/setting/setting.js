const app = getApp()
const {
  _get,
  _post
} = require('../../../utils/http.js')
const {
  passw
} = require('../../../utils/urls.js');

Page({
  data: {
    password:"",
    isFocus: false,
    inputPwd: true,
    inputNum: 0,
    passwordFirst: '',
    passwordTwo: '',
    pass: '请设置新密码',
    is: false
  },
  pwd(e) {
    let reg = /[^\d]/g
    let mobile = e.detail.value.replace(reg, '')
    this.setData({
      password: mobile
    })
  },
  getFocus() {
    this.setData({
      isFocus: true
    })
  },
  onLoad: function(o) {

  },
  submit() {
    const _this = this;
    if (_this.data.password.length == 6) {
      const number = _this.data.password;
      if (_this.data.inputNum == 0) {
        wx.setNavigationBarTitle({
          title: '再次输入密码',
        })
        _this.setData({
          passwordFirst: number,
          inputNum: 1,
          password: '',
          isFocus: false,
          inputPwd: true,
          pass: '请再次输入新密码'
        })
      } else if (_this.data.inputNum == 1) {
        _this.setData({
          passwordTwo: number,
          password: ''
        })
        if (_this.data.passwordFirst == _this.data.passwordTwo) {
          _post(passw, {
            userid: app.globalData.uid,
            password: _this.data.passwordTwo
          }).then(res => {
            if (res.code == 1) {
              app.toast('设置成功', 'success');
              setTimeout(function() {
                wx.navigateBack({
                  delta: 1
                })
              }, 500)
            } else {
              app.toast('设置失败');
            }
          })
        } else {
          app.toast('两次输入密码不同，请重新输入');
          wx.setNavigationBarTitle({
            title: '设置支付密码',
          })
          _this.setData({
            password: '',
            isFocus: false,
            inputPwd: true,
            inputNum: 0,
            passwordFirst: '',
            passwordTwo: '',
            pass: '请手动输入密码'
          })
          return false;
        }
      }
    }
  },
  onShow: function() {
    this.setData({
      password:"",
      isFocus: false,
      inputPwd: true,
      inputNum: 0,
      passwordFirst: '',
      passwordTwo: '',
      pass: '请设置新密码'
    });
  },
})