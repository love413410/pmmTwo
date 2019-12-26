const app = getApp();
const {
  _get,
  _post
} = require('../../utils/http.js');
var {
  baseSrc,
  register,
  code,
  getCity,
  modiUser
} = require('../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    isSHow: true,
    is: false,
    codeText: "",
    time: 60,
    check: false,
    loginText: '登录',
    isDis: false,
    idp: "",
    idc: "",
    idd: ""
  },
  onLoad: function(o) {

  },
  inpChang(e) {
    const cate = e.currentTarget.dataset.id;
    const val = e.detail.value;
    this.setData({
      [cate]: val
    })
  },
  close() {
    this.setData({
      mobile: ''
    })
  },
  getCode() {
    const _this = this;
    const mobile = this.data.mobile;
    if (this.data.is || !(/^1[3456789]\d{9}$/.test(mobile))) {
      app.toast('请输入正确的手机号')
      return;
    }
    const data = {
      mobile: this.data.mobile,
      type: 1
    }
    _get(code, data).then(res => {
      app.toast(res.msg)
    })
    let time = this.data.time;
    _this.setData({
      is: true,
      isSHow: false,
      codeText: time + 's'
    });
    let intTime = setInterval(function() {
      time--;
      if (time > 0) {
        _this.setData({
          is: true,
          isSHow: false,
          codeText: time + "s"
        });
      } else {
        clearInterval(intTime);
        _this.setData({
          time: 60,
          is: false,
          isSHow: true,
          codeText: ""
        });
      }
    }, 1000);
  },
  check(e) {
    let check = e.target.dataset.id;
    this.setData({
      check: !check
    })
  },
  rouTo() {
    wx.navigateTo({
      url: '../userReg/userReg'
    })
  },
  login() {
    const _this=this;
    let check = this.data.check;
    if (check) {
      let data = {
        mobile: this.data.mobile,
        code: this.data.code,
        openid: app.globalData.openId,
        nickname: app.globalData.userInfo.nickName
      };
      _this.setData({
        isDis: true,
        loginText: '登录中'
      })
      _post(register, data).then(res => {
        if (res.code == -1) {
          _this.setData({
            isDis: false,
            loginText: '登录'
          })
          app.toast(res.msg);
        } else {
          app.globalData.uid = res.content.uid;
          this.getLoca();
        }
      })
    } else {
      app.toast('请同意用户协议!')
    }
  },
  getLoca() {
    const _this = this;
    app.getLoca().then(res => {
      let lat = res.latitude;
      let lng = res.longitude;
      const loc = {
        lat: lat,
        lng: lng
      };
      _this.getLocal(loc)
    }).catch(err => {
      setTimeout(function() {
        wx.navigateBack({
          delta: 1
        });
      }, 2000);
    })
  },
  getLocal(loc) {
    const _this = this;
    app.getLocal(loc).then(res => {
      const result = res.result.address_component;
      _this.setData({
        regionStr: `${result.province}${result.city}${result.district}`
      })
      const idpName = result.province;
      const idcName = result.city;
      const iddName = result.district;
      _this.getCity('idp', idpName);
      _this.getCity('idc', idcName);
      _this.getCity('idd', iddName);
    })
  },
  getCity(x, e) {
    const _this = this;
    _get(getCity, {
      name: e
    }).then(res => {
      const idcId = res.content.detail[0].region_id;
      _this.setData({
        [x]: idcId
      })
      const [idp, idc, idd] = [_this.data.idp.length, _this.data.idc.length, _this.data.idd.length];
      if (idp > 0 && idc > 0 && idd > 0 ){
        _this.change();
      }
    })
  },
  change() {
    const data = {
      userid: app.globalData.uid,
      province: this.data.idp,
      city: this.data.idc,
      area: this.data.idd
    };
    _post(modiUser, data).then(r => {
      setTimeout(function() {
        wx.navigateBack({
          delta: 1
        });
      }, 2000);
    })
  },
  onShareAppMessage: function() {

  }
})