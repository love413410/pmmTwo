const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js')
const {
  baseSrc,
  decrDeta,
  rob,
  robPay,
  passwo,
  gloss,
  code
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    mask: -1,
    payIs: true,
    is: false
  },
  onLoad: function(o) {
    if (o.id) {
      this.setData({
        id: o.id,
        t: o.t,
        i: o.is
      })
    } else {
      const scene = decodeURIComponent(o.scene);
      this.setData({
        id: scene
      })
    }
    this.decrDeta();
  },
  move() {
    this.setData({
      mask: -1
    })
  },
  decrDeta() {
    const _this = this;
    _get(decrDeta, {
      userid: app.globalData.uid,
      id: this.data.id
    }).then(res => {
      const task = res.content.task;
      const btn = task.userid == app.globalData.uid ? true : false;
      this.setData({
        task: task,
        btn: btn
      })
    })
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
      this.decrDeta();
    }
  },
  robFn() {
    if (!app.globalData.is) {
      this.setData({
        is: true
      })
      return
    };
    const _this = this;
    _post(rob, {
      userid: app.globalData.uid,
      id: this.data.id
    }).then(res => {
      if (res.code == 1) {
        this.setData({
          payIs: false
        })
      } else {
        app.toast(res.msg)
      }
    })
  },
  fuFn() {
    this.setData({
      payIs: false
    })
  },
  payFn(e) {
    const _this = this;
    const val = e.detail;
    const taskid = this.data.id;
    if (val == 1) {
      _post(robPay, {
        userid: app.globalData.uid,
        payType: 1,
        taskid: taskid,
        price: 5
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
              app.toast('抢单成功', 'success');
              _get(code, {
                userid: app.globalData.uid,
                type: 3,
                taskid: taskid
              })
              setTimeout(_this.decrDeta, 500)
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
    const taskid = _this.data.id;
    this.setData({
      Value: inputValue,
    })
    if (ilen == 6) {
      _get(passwo, {
        userid: app.globalData.uid,
        password: this.data.Value,
      }).then(res => {
        if (res.code == 1) {
          _post(robPay, {
            userid: app.globalData.uid,
            payType: 2,
            taskid: taskid,
            price: 5
          }).then(res => {
            if (res.code == 1) {
              app.toast(res.msg);
              _this.setData({
                Value: '',
                inputValue: '',
                mask: -1
              });
              setTimeout(_this.decrDeta, 500);
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
  dialFn() {
    const _this = this;
    const phone = this.data.task.linkphone;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function(res) {
        _post(link, {
          userid: _this.data.robId,
          taskid: _this.data.task.id
        }).then(res => {
          _this.setData({
            hide: true
          })
          _this.decrDeta();
        })
      }
    })
  },
  rouTo() {
    url: '../../my/rewa/rewa'
  },
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  preview(e) {
    const _this = this;
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: _this.data.task.pics
    })
  },
  authFn() {
    let _this = this;
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success(r) {
        const id = _this.data.task.id;
        const t = _this.data.task.type;
        wx.navigateTo({
          url: '../../my/share/share?id=' + id + '&t=' + t
        })
      },
      fail: (f) => {
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.writePhotosAlbum']) {
              wx.showModal({
                title: '是否授权保存图片功能',
                content: '需要您授权相册功能,否则无法保存！',
                success: tip => {
                  if (tip.confirm) {
                    wx.openSetting({
                      success: data => {
                        if (data.authSetting["scope.writePhotosAlbum"] === true) {
                          wx.authorize({
                            scope: 'scope.writePhotosAlbum'
                          })
                        }
                      }
                    })
                  }
                }
              })
            } else {
              const id = _this.data.task.id;
              const t = _this.data.task.type;
              wx.navigateTo({
                url: '../../my/share/share?id=' + id + '&t=t'
              })
            }
          }
        })
      }
    })
  },
  onShareAppMessage: function() {
    const id = this.data.id;
    return {
      title: '屏买卖',
      path: 'pages/home/newDeta/newDeta?id=' + id
    }
  }
})