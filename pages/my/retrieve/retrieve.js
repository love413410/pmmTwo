const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js')
const {
  code,
  checkCode,
  myDeta
} = require('../../../utils/urls.js');
Page({
  data: {
    mobile: '', 
    code: '',
    counts: 60,
    gettime: true,
    setCount:''
  },
  onLoad: function(options) {
    this.myDeta()
  },
  myDeta() {
    const _this = this;
    const data = {
      userid: app.globalData.uid
    };
    _get(myDeta, data).then(res => {
      if (res.code == -1) {
        app.toast('获取个人信息失败')
      } else {
        const mobile = res.content.user.mobile;
        _this.setData({
          mobile: mobile
        })
      }
    })
  },

  // 获取输入框的值
  formName: function(e) {
    this.setData({
      code: e.detail.value
    })
  },

  // 发送验证码、
  obtainCode() {
    let _this = this;
    let counts = this.data.counts;
    //倒计时主要部分，利用定时器
    let intTime = setInterval(function () {
      counts--;
      if (counts > 0) {
        _this.setData({
          gettime: false,
          codeText: counts + "s"
        });
      } else {
        clearInterval(intTime);
        _this.setData({
          counts: 60,
          is: false,
          gettime: true,
          codeText: ""
        });
      }
    }, 1000);
    _get(code, {
      mobile: _this.data.mobile,
      type:2
    }).then(res => {
      if (res.code = 1) {
        app.toast('验证码发送成功')
      } else {
        app.toast('验证码发送失败')
      }
    })
  }, 

  // 验证验证码
  sureBtn() {
    let _this = this;
    _post(checkCode, {
      mobile: _this.data.mobile,
      code: _this.data.code,
    }).then(res => {
      if (res.code == 1) {
        wx.redirectTo({
          url: '../setting/setting',
        })
      } else {
        app.toast('验证码错误');
      };
    })
  },
  onShareAppMessage: function() {

  }
})