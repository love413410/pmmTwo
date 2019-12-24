const app = getApp();
const {
  _get
} = require('../../../utils/http.js');
const {
  baseSrc,
  getCity,
  getIdd,
  decrList,
  bannerList
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    is: false,
    leve: true,
    tle1: '需求类型',
    tle2: '需求状态',
    city: '未知',
    cityId: '',
    hide: '0',
    arr: ['全部', '终端客户询价', '同行项目外包', '全国维修服务', '全国求购货源', '租赁大屏需求', '新品促销/尾货处理'],
    arr2: ['全部', '未结束'],

    idx1: 0,
    idx2: 0,
    page: 1,
    pagesize: 20,
    idc: '',
    idp: '',
    list: [],


    text: '“新品促销/尾货处理” 有更多优惠活动哦~快来看看吧',
    speed: 1,
    dist: 0,
    isDist: false,
    margin: 60,
    size: 14
  },
  onLoad: function(options) {
    this.bannerList();
  },
  onShow: function() {
    this.setData({
      list: [],
      page: 1
    });
    this.getLoca();//wx.getStorageSync('is')
  },
  leveFn() {
    this.setData({
      leve: false
    })
  },
  levelFn(e) {
    this.setData({
      city: e.detail.val,
      idp: e.detail.idp,
      idc: e.detail.idc,
      list: [],
      page: 1
    })
    this.decrList();
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
      hide: 0
    })
    this.decrList()
  },
  move() {
    this.setData({
      hide: '0'
    })
  },
  //获取用户当前位置
  getLoca() {
    const _this = this;
    app.getLoca().then(res => {
      let lat = res.latitude;
      let lng = res.longitude;
      const loc = {
        lat: lat,
        lng: lng
      }
      _this.setData({
        loc: loc
      })
      _this.getLocal()
    })
  },
  // 经纬度转换成城市
  getLocal() {
    const _this = this;
    app.getLocal(this.data.loc).then(res => {
      _this.setData({
        city: res.result.address_component.province,
        list: [],
        page: 1
      })
      _this.getCity()
    })
  },
  /*
    城市的模糊查询
  */
  getCity() {
    const _this = this;
    _get(getCity, {
      name: this.data.city
    }).then(res => {
      const idcId = res.content.detail[0].region_id;
      _this.setData({
        idp: idcId,
        list: [],
        page: 1
      })
      _this.decrList()
    })
  },
  decrList() {
    const _this = this;
    let data = {
      userid: app.globalData.uid,
      page: this.data.page,
      pagesize: this.data.pagesize,
      type: this.data.idx1,
      searchtype: Number(this.data.idx2 + 1)
    };
    const idc = this.data.idc;
    if (idc != '') {
      data.city = idc
    } else {
      data.province = this.data.idp
    }
    _get(decrList, data).then(res => {
      const list = res.content.list;
      _this.setData({
        list: [..._this.data.list, ...list]
      })
    })
  },
  rouTo(e) {
    if (!app.globalData.is) {
      this.setData({
        is: true
      })
    } else {
      const id = e.currentTarget.dataset.id;
      const ty = e.currentTarget.dataset.ty;
      let src;
      switch (ty) {
        case '1':
          src = '../../home/releDeta/releDeta?id=' + id;
          break;
        case '2':
          src = '../../home/colleDeta/colleDeta?id=' + id;
          break;
        case '3':
          src = '../../home/whoDeta/whoDeta?id=' + id;
          break;
        case '4':
          src = '../../home/couDeta/couDeta?id=' + id;
          break;
        case '5':
          src = '../../home/leaDeta/leaDeta?id=' + id;
          break;
        default:
          src = '../../home/newDeta/newDeta?id=' + id;
      }
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
        page: 1
      })
      this.decrList();
    }
  },
  bannerList() {
    const _this = this;
    _get(bannerList).then(res => {
      const list = res.content.list;
      _this.setData({
        banner: list
      })
    })
  },
  ToUrl(e) {
    const url = e.currentTarget.dataset.url;
    const type = e.currentTarget.dataset.type;
    if (type == 0) {
      wx.navigateTo({
        url: url
      })
    } else {
      if (url.length > 0) {
        const src = '../web/web?url=' + url;
        wx.navigateTo({
          url: src
        })
      } else {
        return fasle;
      }
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