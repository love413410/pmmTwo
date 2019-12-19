const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js')
const {
  baseSrc,
  mySpecialOrderList,
  comple
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    idx: 1,
    list:[],
    page:1,
    pagesize: 20
  },
  onLoad: function (o) {
    if (o.t == 1) {
      const id = o.id;
      wx.setStorageSync('is', 'true');
      app.globalData.is = wx.getStorageSync('is') ? true : false;
      app.globalData.uid = id;
    } 
    
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
    this.list();
  },
  list(){
    const _this = this;
    _get(mySpecialOrderList, {
      userid: app.globalData.uid,
      status: this.data.idx,
      page: this.data.page,
      pagesize: this.data.pagesize
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
    const _this=this;
    const id = e.currentTarget.dataset.id;
    const taskid = e.currentTarget.dataset.taskid;
    wx.showModal({
      title: '确认完成',
      content: '确认此订单已完成吗?',
      cancelColor:'#808080',
      confirmColor: '#fb7313',
      success(res) {
        if (res.confirm) {
          _post(comple, {
            userid: app.globalData.uid,
            id: id
          }).then(res => {
            if (res.code == 1) {
              wx.redirectTo({
                url: '../addFeed/addFeed?id=' + taskid
              })
            }
          })
        }
      }
    })
  },
  rotTo(e){
    const item = e.currentTarget.dataset.item;
    const btn = item.btn_type;
    const id = item.taskid;
    const pid = item.id;
    const c = item.change;
    wx.navigateTo({
      url: '../sendData/sendData?to=3&id=' + id + '&pid=' + pid + '&btn=' + btn +'&c='+c
    })
  },
  toEval(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  onShow: function () {
    this.setData({
      list: [],
      page: 1,
      pagesize: 20,
    })
    this.list();
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