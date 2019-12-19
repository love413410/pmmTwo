const app = getApp();
const {
  _get
} = require('../../../utils/http.js');
const {
  baseSrc,
  myDecr
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    idx: 1,
    n: 1,
    hide: '0',
    pick1: '全部',
    arr: ['全部', '终端客户询价', '同行项目外包', '全国维修服务', '全国求购货源', '租赁大屏需求', '新品促销/尾货处理', '厂家技术预约'],
    arr2: ['全部', '未结束/未过期'],

    tle1: '需求类型',
    tle2: '需求状态',
    idx1: 0,
    idx2: 0,
    page: 1,
    pagesize: 20,
    list: [],
    is: false
  },
  onLoad: function(options) {
    
  },
  onShow:function(){
    if (!app.globalData.is) {
      this.setData({
        is: true
      })
      return
    };

    this.setData({
      page: 1,
      status: 1,
      list:[],
      type: 0,
      searchtype: 0
    });
    this.myDecr()
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
        page: 1,
        status: 1,
        list: [],
        type: 0,
        searchtype: 0
      });
      this.myDecr()
    }
  },
  swta(e) {
    const idx = e.currentTarget.dataset.idx;
    if (idx==0){
      this.setData({
        idx: idx,
        list: [],
        page: 1
      });
    }else{
      this.setData({
        idx: idx,
        list: [],
        page: 1,
        tle1: '需求类型',
        tle2: '需求状态',
        idx1: 0,
        idx2: 0,
      });
    }
    
    this.myDecr()
  },
  scr(e) {
    this.setData({
      hide: e.currentTarget.dataset.id
    })
  },
  add(e) {
    this.setData({
      [e.currentTarget.dataset.idx]: e.currentTarget.dataset.idxs
    })
  },
  subFn(e) {
    this.setData({
      [e.currentTarget.dataset.name]: this.data[e.currentTarget.dataset.arr][this.data[e.currentTarget.dataset.idx]],
      list: [],
      page: 1,
      hide: -1
    })
    this.myDecr()
  },

  move() {
    this.setData({
      hide: '0'
    })
  },
  pickFn(e) {
    this.setData({
      pick1: e.detail.value,
      list: [],
      page: 1
    })
    this.myDecr()
  },
  myDecr() {
    const _this = this;
    const searchtime = this.data.pick1 == '全部' ? '' : this.data.pick1;
    _get(myDecr, {
      userid: app.globalData.uid,
      page: this.data.page,
      pagesize: this.data.pagesize,
      status: this.data.idx,
      searchtime: searchtime,
      type: this.data.idx1,
      searchtype: Number(this.data.idx2 + 1)
    }).then(res => {
      const list = res.content.list;
      _this.setData({
        list: [..._this.data.list, ...list]
      })
    })
  },
  rouTo(e) {
    const x = e.currentTarget.dataset.item.type;
    const id = e.currentTarget.dataset.item.id;
    if (x == 1 || x == 5 || x == 6) {
      wx.navigateTo({
        url: '../detaYi/detaYi?id=' + id
      })
    } else if (x == 2 || x == 3 || x == 4 || x == 7) {
      wx.navigateTo({
        url: '../detaEr/detaEr?id=' + id
      })
    }
  },
  toRou(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detaSan/detaSan?id=' + id
    });
  },
  onReachBottom: function() {
    const page = this.data.page;
    this.setData({
      page: page + 1
    })
    this.myDecr();
  },
  onShareAppMessage: function() {

  }
})