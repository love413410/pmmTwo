const app = getApp();
const {
  _get
} = require('../../../utils/http.js')
const {
  baseSrc,
  mySugg
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    page:1,
    pagesize:20,
    list:[],
    is:-1,
    uid: app.globalData.uid
  }, 
  onLoad: function (o) {
    if(o.id){
      this.setData({
        uid:o.id
      })
    }
    this.lookFn();
  },
  lookFn(){
    const _this=this;
    _get(mySugg, {
      userid: this.data.uid,
      page: this.data.page,
      pagesize: this.data.pagesize
    }).then(res => {
      const list = res.content.list;
      _this.setData({
        list: [..._this.data.list, ...list]
      })
    })
  },
  showFn(e){
    const id = e.currentTarget.dataset.id;
    const is=this.data.is;
    const iss = id == is ? -1 : id;
    this.setData({
      is: iss
    })
  },
  preview(e){
    const _this = this;
    const url = e.currentTarget.dataset.url;
    const arr = _this.data.list[e.currentTarget.dataset.idx].pics;
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: arr
    })
  },

  onReachBottom: function () {
    const page = this.data.page;
    this.setData({
      page: page + 1
    })
    this.lookFn();
  },

  onShareAppMessage: function () {

  }
})