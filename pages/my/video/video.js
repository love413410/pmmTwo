const app = getApp();
const {
  _get
} = require('../../../utils/http.js')
const {
  mediaList
} = require('../../../utils/urls.js');
Page({
  data: {
    page: 1,
    pagesize: 20,
    list: []
  },
  onLoad: function (options) {
    this.mediaList();
  },
  mediaList(){
    const _this = this;
    const data = {
      page: this.data.page,
      pagesize: this.data.pagesize
    };
    _get(mediaList, data).then(res => {
      const list = res.content.list;
      _this.setData({
        list: [..._this.data.list, ...list]
      })
    })
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
    this.mediaList();
  },
  onShareAppMessage: function () {

  }
})