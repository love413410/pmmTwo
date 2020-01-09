const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js')
const {
  baseSrc,
  decrList,
  rob
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    is: false,
    tempPage:"",
    page: 1,
    pagesize: 20,
    list: []
  },
  onLoad: function(options) {
    this.decrList();
  },
  onShow:function(){
    this.setData({
      list: [],
      page: 1,
      tempPage: ''
    });
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
      const page = res.content.page;
      const tempPage = _this.data.tempPage;
      if (page != tempPage) {
        _this.setData({
          list: [..._this.data.list, ...list],
          tempPage: page
        })
      }
    })
  },

  grabFn(e) {
    if (!app.globalData.is) {
      this.setData({
        is: true
      });
      return false;
    };
    const ty = e.currentTarget.dataset.ty;
    const id = e.currentTarget.dataset.id;
    const url = '../../home/newDeta/newDeta?id=' + id + '&s=1';

    const _this = this;
    _post(rob, {
      userid: app.globalData.uid,
      id: id
    }).then(res => {
      if (res.code == 1) {
        wx.navigateTo({
          url: url
        })
      } else {
        app.toast(res.msg)
      }
    })
  },
  rouTo(e) {
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
    } else {
      this.setData({
        list: [],
        page: 1,
        tempPage: ""
      })
      this.decrList();
    }
  },
  onReachBottom: function() {
    const page = this.data.page;
    this.setData({
      page: page + 1
    })
    this.decrList();
  },
  onShareAppMessage: function() {

  }
})