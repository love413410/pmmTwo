const app = getApp();
const {
  _get
} = require('../../../utils/http.js')
const {
  baseSrc,
  tender
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    page: 0,
    pagesize: 20,
    list: []
  }, 
  onLoad: function (options) {
    wx.removeStorageSync('tende');
    this.list();
  },
  list(){
    const _this=this;
    const data={
      page: this.data.page,
      pagesize: this.data.pagesize
    };
    _get(tender, data).then(res => {
      const list = res.content.list;
      _this.setData({
        list: [..._this.data.list, ...list]
      })
    })
  },
  navTo(e){
    const item = e.currentTarget.dataset.item;
    wx.setStorageSync("tende", item);
    wx.navigateTo({
      url: '../tendeData/tendeData'
    })
  },
  onReachBottom: function () {
    const page = this.data.page;
    this.setData({
      page: page + 1
    })
    this.list();
  },
  onShareAppMessage: function () {

  }
})