const app = getApp();
const {
  _get
} = require('../../../utils/http.js')
const {
  exeList
} = require('../../../utils/urls.js');
Page({
  data: {
    page:1,
    pagesize: 20,
    list: []
  },
  onLoad: function (options) {
    this.exeList();
  },
  exeList(){
    const _this = this;
    const data = {
      page: this.data.page,
      pagesize: this.data.pagesize
    };
    _get(exeList, data).then(res => {
      const list = res.content.list;
      _this.setData({
        list: [..._this.data.list, ...list]
      })
    })
  },
  lookFn(e){
    const url = e.currentTarget.dataset.url;
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
        app.toast('文档打开失败！');
      }
    });
  },
  ctrlFn(e) {
    const url = e.currentTarget.dataset.url;
    wx.setClipboardData({
      data: url,
      success: function () {
        app.toast('地址复制成功,请至浏览器下载！')
      }
    });
  },
  onReachBottom: function () {
    const page = this.data.page;
    this.setData({
      page: page + 1
    })
    this.exeList();
  },
  onShareAppMessage: function () {

  }
})