const app = getApp();
const {
  _get
} = require('../../../utils/http.js');
const {
  baseSrc,
  exlist
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    idx: 0,
    page: 1,
    pagesize: 20,
    list:[],
    uid: app.globalData.uid
  },
  onLoad: function(o) {
    if(o.id){
      this.setData({
        uid: o.id,
        idx:o.t
      })
    }
    this.exlist();
  },
  exlist(){
    _get(exlist, {
      userid: this.data.uid,
      status:this.data.idx,
      page: this.data.page,
      pagesize: this.data.pagesize
    }).then(res => {
      const list = res.content.list;
      this.setData({
        list: [...this.data.list, ...list]
      })
    })
  },
  to(e) {
    const c = e.currentTarget.dataset.id;
    wx.setClipboardData({
      data: c,
      success: function (res) {
        app.toast('复制成功')
      }
    });
  },
  swta(e){
    const idx = e.currentTarget.dataset.idx;
    this.setData({
      idx: idx,
      page: 1,
      list: []
    })
    this.exlist();
  },
  onReachBottom: function() {
    const page = this.data.page;
    this.setData({
      page: page + 1
    })
    this.exlist();
  },
  onShareAppMessage: function() {

  }
})