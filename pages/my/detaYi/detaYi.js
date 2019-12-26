const app = getApp();
const {
  _get
} = require('../../../utils/http.js')
const {
  baseSrc,
  decrDeta
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    hide:false
  },
  onLoad: function (o) {
    const _this = this;
    _get(decrDeta, {
      userid: app.globalData.uid,
      id: o.id,
      source:1
    }).then(res => {
      this.setData({
        task: res.content.task
      })
    })
  },
  preview(e) {
    const _this = this;
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: _this.data.task.pics
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
  onShareAppMessage: function () {
    const type = this.data.task.type;
    const id = this.data.task.id;
    let src;
    switch (type) {
      case '1':
        src = 'pages/home/releDeta/releDeta?id=' + id;
        break;
        src = 'pages/home/couDeta/couDeta?id=' + id;
        break;
      case '5':
        src = 'pages/home/leaDeta/leaDeta?id=' + id;
        break;
      default:
        src = 'pages/home/newDeta/newDeta?id=' + id;
    };
    return {
      title: '新订单',
      path: src,
      imageUrl: baseSrc +'cover.png'
    }
  }
})