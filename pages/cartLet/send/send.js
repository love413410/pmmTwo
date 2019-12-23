const app = getApp();
const {
  _get
} = require('../../../utils/http.js')
const {
  baseSrc,
  spec
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    idx: 1,
    page: 1,
    pagesize: 20,
    list: []
  },
  onLoad: function () {
    
  },
  onShow:function(){
    this.setData({
      page: 1,
      list: []
    })
    this.spec();
  },
  swta(e) {
    const idx = e.currentTarget.dataset.idx;
    if (idx == 0) {
      this.setData({
        idx: idx,
        list: [],
        page: 1
      });
    } else {
      this.setData({
        idx: idx,
        list: [],
        page: 1
      });
    }
    this.spec();
  },
  spec() {
    const _this = this;
    _get(spec, {
      userid: app.globalData.uid,
      page: this.data.page,
      pagesize: this.data.pagesize,
      type:2,
      status: this.data.idx
    }).then(res => { 
      if (res.code == 1) {
        const list = res.content.list;
        _this.setData({
          list: [..._this.data.list, ...list]
        })
      }
    })
  },

  send(e){
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../data/data?id=' + id,
    })
  },
  rouTo(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../sendData/sendData?to=2&id='+id
    })
  },

  onReachBottom: function () {
    const page = this.data.page;
    this.setData({
      page: page + 1
    })
    this.spec();
  },
  onShareAppMessage: function () {

  }
})