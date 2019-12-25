const app = getApp();
const {
  _get
} = require('../../../utils/http.js')
const {
  fileDeta
} = require('../../../utils/urls.js');
Page({
  data: {
    is: false,
    task:{}
  },
  onLoad: function(o) {
    this.setData({
      id: o.id
    })
    // this.setData({
    //   id: 159
    // });
    if (!app.globalData.is) {
      this.setData({
        is: true
      })
      return false;
    }else{
      this.dateFn()
    }
  },
  dateFn() {
    _get(fileDeta, {
      userid: app.globalData.uid,
      wjid: this.data.id
    }).then(res => {
      const task = res.content.detail;
      this.setData({
        task: task
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
      this.setData({
        is:false
      })
      this.dateFn();
    }
  },
  lookFn() {
    if (!app.globalData.is) {
      this.setData({
        is: true
      })
      return false;
    } else {
      const task = this.data.task;
      const ty=task.type;
      const url = task.content;
      if (ty==2){
        wx.showLoading({
          title: '正在打开文档'
        });
        wx.downloadFile({
          url: url,
          success: function (res) {
            const path = res.tempFilePath;
            wx.openDocument({
              filePath: path,
              success: function () {
                wx.hideLoading();
              },
              fail: function () {
                app.toast('文档打开失败！');
                wx.hideLoading();
              }
            })
          },
          fail: function (err) {
            wx.hideLoading();
            app.toast('打开失败！');
          }
        });
      };
      if (ty==3){
        var pics = [];
        pics.push(url);
        wx.showLoading({
          title: '正在寻找图片资源'
        });
        wx.previewImage({
          current: url,
          urls: pics,
          success: function () {
            wx.hideLoading();
          },
          fail: function () {
            app.toast('图片打开失败！');
            wx.hideLoading();
          }
        })
      }
    }
  },
  ctrlFn(){
    const url = this.data.task.content;
    wx.setClipboardData({
      data: url,
      success: function () {
        app.toast('地址复制成功,请至浏览器下载！')
      }
    });
  },
  isFn(){
    this.setData({
      is: true
    })
  },
  onShareAppMessage: function() {

  }
})