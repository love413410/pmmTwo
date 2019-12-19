const app = getApp();
const {
  _post,
  _get
} = require('../../../utils/http.js')
const {
  baseSrc,
  withdraw,
  passwo
} = require('../../../utils/urls.js');

Page({
  data: {
    baseSrc: baseSrc,
    val: '',
    money: 0,
    moneys: '',
    sty: false,
    opac: false,
    isFocus: true,
    Value: ""
  },
  onLoad: function(o) {
    const _this = this;
    const val = o.num;
    this.setData({
      money: val,
      moneys: '当前钱包余额' + val + '元,'
    })
  },
  inpt(e) {
    const val = e.detail.value;
    const money = this.data.money;
    this.setData({
      val: val
    });
    if (val.length > 0) {
      this.setData({
        opac: true
      })
    } else {
      this.setData({
        opac: false
      })
    }
    if (val > money) {
      this.setData({
        moneys: '金额已超过可提现余额',
        sty: true
      })
    } else {
      this.setData({
        moneys: '当前钱包余额' + money + '元,',
        sty: false
      })
    }
  },
  all() {
    const money = this.data.money;
    this.setData({
      val: money,
      opac: true
    })
  },
  btn() {
    const val = this.data.val;
    const bool = app.trim(val);
    const cost = Math.ceil(val) * 0.01 < 0.1 ? 0.10 : Math.ceil(val) * 0.01;
    if (!bool && val <= 0) {
      app.toast('请输入提现金额')
      return
    } else {
      const _this = this;
      this.setData({
        mask: 2,
        cost: cost
      })
      // _post(withdraw, {
      //   userid: app.globalData.uid,
      //   price: val
      // }).then(res => {
      //   if (res.code == 1) {
      //     wx.navigateBack({
      //       delta: 1,
      //     })
      //   }
      //   app.toast(res.msg)
      // })
    }
  },

  Focus(e) {
    var _this = this;
    var inputValue = e.detail.value;
    var ilen = inputValue.length;
    const val = this.data.val;
    this.setData({
      Value: inputValue,
    })
    if (ilen == 6) {
      _get(passwo, {
        userid: app.globalData.uid,
        password: this.data.Value,
      }).then(res => {
        if (res.code == 1) {
          _post(withdraw, {
            userid: app.globalData.uid,
            price: val
          }).then(res => {
            if (res.code == 1) {
              setTimeout(_this.back, 500)
            }
            app.toast(res.msg)
          })
        } else {
          app.toast(res.msg)
        }
      })
    }
  },
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  move() {
    this.setData({
      mask: -1,
      Value: ''
    })
  },
  onShareAppMessage: function() {

  }
})