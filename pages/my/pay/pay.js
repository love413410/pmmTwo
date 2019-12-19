const app = getApp();
const {
  _get
} = require('../../../utils/http.js')
const {
  baseSrc,
  wall
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    page: 1,
    pagesize: 20,
    stime: "",
    list: [],
    time: '',
    pick: ['全部', '支出', '收入'],
    pickVal: '全部',
    type:0

  },
  onLoad: function (options) {
    const date = new Date();
    const y = date.getFullYear();
    const month = date.getMonth() + 1;
    const m = month >= 10 ? month : '0' + month;
    const day = date.getDate();
    const d = day >= 10 ? day : '0' + day;
    const time = `${y}-${m}-${d}`;
    this.setData({
      time: time
    })
    this.wall()
  },
  onShow:function(){
    
  },
  wall() {
    const _this = this;
    _get(wall, {
      userid: app.globalData.uid,
      page: this.data.page,
      pagesize: this.data.pagesize,
      stime: this.data.stime,
      type:this.data.type
    }).then(res => {
      if (res.code == 1) {
        const list = res.content.list;
        _this.setData({
          list: [..._this.data.list, ...list],
          income: res.content.income,
          outgo: res.content.outgo,
          balance: res.content.balance,
        })
      }
    })
  },
  stime(e) {
    this.setData({
      stime: e.detail.value,
      page: 1,
      list: []
    })
    this.wall()
  },
  pickFn(e){
    const pickVal = this.data.pick[e.detail.value];
    this.setData({
      pickVal: pickVal,
      type: e.detail.value,
      page: 1,
      list: []
    });
    this.wall()
  },
  navTo(e) {
    /*
    由于数据太多,不建议页面传参
    要在下个页面用一下
    暂时缓存一下,下个页面清除
    */
    const temp = e.currentTarget.dataset.temp;
    wx.navigateTo({
      url: '../payDate/payDate?id=' + temp.statement_id,
    })
  },
  onReachBottom: function () {
    const page = this.data.page;
    this.setData({
      page: page + 1
    })
    this.wall()
  },
  onShareAppMessage: function () {

  }
})