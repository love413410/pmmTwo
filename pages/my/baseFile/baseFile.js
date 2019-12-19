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
    if (!app.globalData.is) {
      this.setData({
        is: true
      })
      return false;
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
        wx.downloadFile({
          url: url,
          success: function (res) {
            const path = res.tempFilePath;
            wx.saveFile({
              tempFilePath: path,
              success(r) {
                const paths = r.savedFilePath;
                wx.openDocument({
                  filePath: paths
                })
              }
            })
          },
          fail: function (err) {
            app.toast('打开失败！')
          }
        });
      };
      if (ty==3){
        var pics = [];
        pics.push(url)
        wx.previewImage({
          current: url,
          urls: pics
        })
      }
    }
  },
  isFn(){
    this.setData({
      is: true
    })
  },
  onShareAppMessage: function() {

  }
})