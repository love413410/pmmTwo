const app = getApp();
const {
  _post
} = require('../../../utils/http.js')
const {
  createQcode
} = require('../../../utils/urls.js');
Page({
  data: {
    src:""
  },
  onLoad: function (o) {
    const _this=this;
    const t=o.t;
    const id=o.id;
    let src;
    switch (t) {
      case '1':
        src = 'pages/home/releDeta/releDeta';
        break;
      case '2':
        src = 'pages/home/colleDeta/colleDeta';
        break;
      case '3':
        src = 'pages/home/whoDeta/whoDeta';
        break;
      case '4':
        src = 'pages/home/couDeta/couDeta';
        break;
      case '5':
        src = 'pages/home/leaDeta/leaDeta';
        break;
      default:
        src = 'pages/home/newDeta/newDeta';
    };
    wx.showLoading({
      title: '图片正在生成'
    })
    _post(createQcode, {
      page: src,
      id: id
    }).then(res => {
      wx.hideLoading();
      _this.setData({
        src: res.content
      })
    })
  },
  click() {
    const _this = this;
    wx.downloadFile({
      url: _this.data.src,
      success(r) {
        wx.saveImageToPhotosAlbum({
          filePath: r.tempFilePath,
          success: function () {
            app.toast('图片保存成功')
          },
          fail: (err) => {
            wx.getSetting({
              success(res) {
                var statu = res.authSetting;
                if (!statu['scope.writePhotosAlbum']) {
                  wx.showModal({
                    title: '是否授权相册功能',
                    content: '需要使用您的相册功能，请确认授权，否则保存图片功能将无法使用',
                    success: tip => {
                      if (tip.confirm) {
                        wx.openSetting({
                          success: data => {
                          }
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        })
      }
    })
  },
  onShareAppMessage: function () {

  }
})