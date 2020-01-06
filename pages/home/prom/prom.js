const app = getApp();
const {
  _get
} = require('../../../utils/http.js')
const {
  baseSrc,
  decrList
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    is: false,
    page: 1,
    pagesize: 20,
    list: []
  },
  onLoad: function (options) {
    this.decrList();
  },
  decrList() {
    const _this = this;
    let data = {
      userid: app.globalData.uid,
      page: this.data.page,
      pagesize: this.data.pagesize,
      type: 6
    };
    _get(decrList, data).then(res => {
      const list = res.content.list;
      _this.setData({
        list: [..._this.data.list, ...list]
      })
    })
  },
  rouTo(e){
    if (!app.globalData.is) {
      this.setData({
        is: true
      })
    } else {
      const id = e.currentTarget.dataset.id;
      const src = '../../home/newDeta/newDeta?id=' + id;
      wx.navigateTo({
        url: src
      })
    }
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
    }
  },
  onReachBottom: function () {
    const page = this.data.page;
    this.setData({
      page: page + 1
    })
    this.decrList();
  },
  onShareAppMessage: function () {

  }
})