const app=getApp();
const {
  baseSrc
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    h:'',
    temp1: `${baseSrc}mb.png`,
    temp2: `${baseSrc}sl.png`
  },
  onLoad: function (options) {
    const _this=this;
    wx.getSystemInfo({
      success(r){
        var is = r.system.indexOf('iOS')>-1;
        _this.setData({
          h: r.windowHeight * r.pixelRatio+'rpx',
          is: is
        })
      }
    })
  },
  loadFn(e){
    const is = this.data.is;
    const url = e.currentTarget.dataset.url;
    const _this=this;
    wx.downloadFile({
      url: url,
      success(r) {
        wx.saveImageToPhotosAlbum({
          filePath: r.tempFilePath,
          success:function(){
            if (is){
              app.toast('图片保存成功')
            }
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