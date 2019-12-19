const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js')
const {
  baseSrc,
  decrDeta,
  robPay,
  passwo
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    is: false,
    payIs: true,
    val: '',
    type: ''
  },
  onLoad: function(o) {
    this.setData({
      taskid: o.id
    });
    this.decrDeta();
  },
  decrDeta() {
    const _this = this;
    _get(decrDeta, {
      userid: app.globalData.uid,
      id: this.data.taskid
    }).then(res => {
      const task = res.content.task;
      this.setData({
        taskid: res.content.task.id,
        type: res.content.task.type,
        task: res.content.task
      })
    })
  },
  priVal(e) {
    this.setData({
      val: e.detail.value
    })
  },
  priFn() {
    if (!app.trim(this.data.val)) {
      app.toast('请输入报价！')
      return;
    }
    this.setData({
      payIs: false
    })
  },
  payFn(e) {
    if (e.detail == 1) {
      const _this = this;
      _post(robPay, {
        userid: app.globalData.uid,
        payType: 1,
        taskid: this.data.taskid,
        price: this.data.val
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
              wx.switchTab({
                url: '../../tabbar/home/home',
              })
              app.toast('报价成功', 'success');
            },
          })
        }
      });
    } else if (e.detail == 2) {
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
        password: _this.data.Value,
      }).then(res => {
        if (res.code == 1) {
          const data = {
            userid: app.globalData.uid,
            payType: 2,
            taskid: _this.data.taskid,
            price: _this.data.val
          };
          _post(robPay, data).then(res => {
            if (res.code == 1) {
              app.toast(res.msg);
              _this.setData({
                Value: '',
                inputValue: '',
                mask: -1
              });
              wx.switchTab({
                url: '../../tabbar/home/home',
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
  tabFn() {
    this.setData({
      is: !this.data.is
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