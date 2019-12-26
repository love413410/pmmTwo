const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js')
const {
  baseSrc,
  myDeta,
  decrDeta,
  rob
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    is: false
  },
  onLoad: function(o) {
    if (o.id) {
      this.setData({
        id: o.id,
        t: o.t
      })
    } else {
      const scene = decodeURIComponent(o.scene);
      this.setData({
        id: scene
      })
    }
    this.decrDeta();
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
  move() {
    this.setData({
      mask: -1
    })
  },
  auth() {
    var src = this.data.isA == 0 ? '../../rele/auth/auth' : '../../rele/auth2/auth2';
    wx.navigateTo({
      url: src
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
    }else{
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
    const _this=this;
    _get(myDeta, {
      userid: app.globalData.uid
    }).then(res => {
      const isA = res.content.user.is_approve;
      const isB = res.content.user.is_vip;
      let iss, mask;
      if (isA != 2 && isB != 1) {
        this.setData({
          mask: 1,
          isA: isA
        })
        return;
      } else {
        _this.rob();
      }
    })
  },
  rob() {
    const _this = this;
    _post(rob, {
      userid: app.globalData.uid,
      id: this.data.id
    }).then(res => {
      if (res.code == 1) {
        wx.redirectTo({
          url: '../price/price?id=' + this.data.id
        });
      } else {
        app.toast(res.msg)
      }
    })
  },
  price() {
    wx.redirectTo({
      url: '../price/price?id=' + this.data.id
    });
  },
  preview(e) {
    const _this = this;
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: _this.data.task.pics
    })
  },
  authFn(){
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
      title: '新订单',
      path: 'pages/home/colleDeta/colleDeta?id=' + id
    }
  }
})