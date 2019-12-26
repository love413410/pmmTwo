const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js')
const {
  baseSrc,
  decrDeta,
  link,
  gloss,
  code
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    hide: true
  },
  onLoad: function(o) {
    this.setData({
      id: o.id
    });
    this.decrDeta();
  },
  decrDeta() {
    const _this = this;
    _get(decrDeta, {
      userid: app.globalData.uid,
      id: this.data.id,
      source: 1
    }).then(res => {
      this.setData({
        task: res.content.task,
        list: res.content.task.roblist
      })
    })
  },

  callFn(e) {
    this.setData({
      hide: false,
      phone: e.currentTarget.dataset.num,
      robId: e.currentTarget.dataset.robid,
      qdid: e.currentTarget.dataset.qdid
    })
  },
  dialFn() {
    const _this = this;
    const phone = this.data.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function (res) {
        _post(link, {
          userid: _this.data.robId,
          taskid: _this.data.task.id
        }).then(res => {
          const type = _this.data.task.type;
          if (type!=7){
            _get(code, {
              userid: app.globalData.uid,
              type: 4,
              taskid: _this.data.qdid
            })
          }
          _this.setData({
            hide: true
          })
          _this.decrDeta();
        });
      }
    })
  },
  move() {
    this.setData({
      hide: true
    })
  },
  auth() {
    let _this = this;
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success(r) {
        const id = _this.data.task.id;
        const t = _this.data.task.type;
        wx.navigateTo({
          url: '../share/share?id=' + id + '&t=' + t
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
                url: '../share/share?id=' + id + '&t=t'
              })
            }
          }
        })
      }
    })
  },

  preview(e) {
    const _this = this;
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: _this.data.task.pics
    })
  },

  // share
  onShareAppMessage: function() {


    const type = this.data.task.type;
    const id = this.data.task.id;
    let src;
    switch (type) {
      // case '1':
      //   src = 'pages/home/releDeta/releDeta?id=' + id;
      //   break;
      case '2':
        src = 'pages/home/colleDeta/colleDeta?id=' + id;
        break;
      case '3':
        src = 'pages/home/whoDeta/whoDeta?id=' + id;
        break;
      case '4':
        src = 'pages/home/couDeta/couDeta?id=' + id;
        break;
      // case '5':
      //   src = 'pages/home/leaDeta/leaDeta?id=' + id;
      //   break;
      default:
        src = 'pages/home/newDeta/newDeta?id=' + id;
    };
    return {
      title: '新订单',
      path: src,
      imageUrl: `${baseSrc}cover.png`
    }

  }
})