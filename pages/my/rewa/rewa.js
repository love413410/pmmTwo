const app = getApp();
const {
  _post,
  _get
} = require('../../../utils/http.js')
const {
  baseSrc,
  passwo,
  reward
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    is: true,
    val: '0.00',
    isDi: true,
    payIs: true
  },
  onLoad: function(o) {
    this.setData({
      id:o.id
    })
  },
  subFn(e) {
    const i = e.currentTarget.dataset.i;
    if (i == 1) {
      const val = e.detail.value;
      if (val.length > 0) {
        this.setData({
          val: val,
          isDi: false,
          is:true
        })
      } else {
        this.setData({
          val: '0.00',
          isDi: true,
          is: true
        })
      }
    } else {
      const val = this.data.val;
      if (Number(val)<5) {
        this.setData({
          is:false
        })
      }else{
        this.setData({
          payIs: false
        })
      }
    }
  },
  payFn(e) {
    const _this = this;
    const val = e.detail;
    if (val == 1) {
      _post(reward, {
        userid: app.globalData.uid,
        payType: 1,
        rewardid: this.data.id,
        total_fee: this.data.val
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
              wx.navigateBack({
                delta: 1
              })
            },
          })
        }
      })
    } else if (val == 2) {
      this.setData({
        mask: 2,
        isFocus: true
      })
    } else if (val == -1) {
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
        password: _this.data.Value,
      }).then(res => {
        if (res.code == 1) {
          _post(reward, {
            userid: app.globalData.uid,
            payType: 2,
            rewardid: this.data.id,
            total_fee: _this.data.val
          }).then(res => {
            if (res.code == 1) {
              app.toast(res.msg);
              _this.setData({
                Value: '',
                inputValue: '',
                mask: -1
              });
              wx.navigateBack({
                delta:1
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
      mask: -1,
      Value: ''
    })
  },
  onShareAppMessage: function() {

  }
})