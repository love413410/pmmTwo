const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js');
const {
  baseSrc,
  myRob,
  discuss,
  comple
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    idx: 1,
    page: 1,
    pagesize: 20,
    list: [],
    sub: 0,
    isTrue: 1,
    good:1
  },
  onLoad: function(options) {

  },
  headFn(e) {
    const idx = e.currentTarget.dataset.idx;
    this.setData({
      idx: idx,
      list: [],
      page: 1,
      sub: 0
    })
    this.myRob()
    // idx == 1 ? this.myRob() : this.myRobs();
  },
  subFn(e) {
    this.setData({
      sub: e.currentTarget.dataset.sub,
      list: [],
      page: 1
    });
    this.myRob()
  },
  onShow: function() {
    this.setData({
      idx: 1,
      page: 1,
      pagesize: 20,
      list: [],
      sub: 1,
      isTrue: 1
    })
    this.myRob()
  },
  myRob() {
    const _this = this;
    const type = this.data.idx;
    const data = {
      userid: app.globalData.uid,
      page: this.data.page,
      pagesize: this.data.pagesize,
      type: this.data.idx,
      status: this.data.sub
    };
    if (type == 1) {
      delete data.status;
    }
    _get(myRob, data).then(res => {
      const list = res.content.list;
      _this.setData({
        list: [..._this.data.list, ...list],
        ztotal: res.content.ztotal,
        wtotal: res.content.wtotal,
        ytotal: res.content.ytotal
      })
    })
  },
  // 评价
  swtaImg(e) {
    this.setData({
      isTrue: e.currentTarget.dataset.t
    })
  },
  r_subFn() {
    _post(discuss, {
      userid: app.globalData.uid,
      type: this.data.isTrue,
      id: this.data.id,
      source: 1
    }).then(res => {
      app.toast(res.msg);
      this.setData({
        mask: -1,
        isTrue: 1,
        list: [],
        page: 1
      });
      this.myRob();
    })
  },
  rouTo(e) {
    const id = e.currentTarget.dataset.id;
    const ty = e.currentTarget.dataset.ty;
    const is = this.data.sub;
    let src;
    switch (ty) {
      case '1':
        src = '../../home/releDeta/releDeta?t=0&id=' + id;
        break;
      case '2':
        src = '../../home/colleDeta/colleDeta?t=0&id=' + id;
        break;
      case '3':
        src = '../../home/whoDeta/whoDeta?t=0&id=' + id + '&is=' + is;
        break;
      case '4':
        src = '../../home/couDeta/couDeta?t=0&id=' + id;
        break;
      case '5':
        src = '../../home/leaDeta/leaDeta?t=0&id=' + id;
        break;
      default:
        src = '../../home/newDeta/newDeta?t=0&id=' + id + '&is=' + is;
    }
    wx.navigateTo({
      url: src
    })
  },
  // 评价
  move(e) {
    const x = e.currentTarget.dataset.x;
    const id = e.currentTarget.dataset.id;
    if (id) {
      this.setData({
        mask: x,
        id: id
      });
    } else {
      this.setData({
        mask: x
      });
    };
  },
  // 打赏
  toRou(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },
  // 去付款
  toPrFn(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../home/price/price?id=' + id,
    })
  },
  //查看评价
  lookFn(e){
    const look = e.currentTarget.dataset.look;
    this.setData({
      mask:4,
      good: look
    })
  },
  onReachBottom: function() {
    const page = this.data.page;
    this.setData({
      page: page + 1
    })
    this.myRob();
  },
  onShareAppMessage: function() {

  }
})