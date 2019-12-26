const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js');
const {
  baseSrc,
  getCity,
  getIdd,
  decrList,
  bannerList,
  myDeta,
  rob
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
    tempPage: "",
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
      mask:-1
    });
    this.getLoca();
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
      page: 1,
      tempPage: ""
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
      [e.currentTarget.dataset.idx]: e.currentTarget.dataset.idxs,
      tempPage: ""
    })
  },
  subFn(e) {
    this.setData({
      [e.currentTarget.dataset.name]: this.data[e.currentTarget.dataset.arr][this.data[e.currentTarget.dataset.idx]],
      list: [],
      page: 1,
      hide: 0,
      tempPage: ""
    })
    this.decrList()
  },
  move() {
    this.setData({
      hide: '0',
      mask:-1
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
        page: 1,
        tempPage: ''
      })
      _this.decrList();
      _this.myDeta();
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
      console.log(list)
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
  myDeta(){
    const _this = this;
    _get(myDeta, {
      userid: app.globalData.uid
    }).then(res => {
      const isA = res.content.user.is_approve;
      const isB = res.content.user.is_vip;
      let iss, mask;
      if (isB == 0) {
        if (isA == 2) {
          iss = 2;
        } else {
          iss = 1;
        }
      } else {
        iss = 3;
      }
      _this.setData({
        iss: iss,
        isA: isA
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
      this.getLoca();
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
  grabFn(e) {
    if (!app.globalData.is) {
      this.setData({
        is: true
      });
      return false;
    };
    const ty = e.currentTarget.dataset.ty;
    const id = e.currentTarget.dataset.id;
    const is=this.data.iss;
    var url = '../../home/price/price?id=' + id,mask=-1;
    switch (ty) {
      case '1':
        is == 1 ? mask = 1 : this.robFn(id);
        break;
      case '2':
        is == 1 ? mask = 1 : this.rouFn(id, url);
        break;
      case '3':
        this.rouFn(id, url);
        break;
      case '4':
        this.rouFn(id, url);
        break;
      case '5':
        is == 1 ? mask = 1 : this.robFn(id);
        break;
      default:
        url = '../../home/newDeta/newDeta?id=' + id+'&s=1';
        this.rouFn(id,url);
    };
    this.setData({
      mask:mask
    });
  },
  robFn(id){
    const _this = this;
    _post(rob, {
      userid: app.globalData.uid,
      id: id
    }).then(res => {
      if (res.code == 1) {
        app.toast(res.msg, 'success')
        setTimeout(this.getLoca, 5000)
      } else if (res.code == 2) {
        _this.setData({
          mask: 2,
          msg: res.msg
        })
      } else {
        app.toast(res.msg)
      }
    })
  },
  rouFn(id,url){
    const _this = this;
    _post(rob, {
      userid: app.globalData.uid,
      id: id
    }).then(res => {
      if (res.code == 1) {
        wx.navigateTo({
          url: url
        })
      } 
    })
  },
  auth() {
    var url = this.data.isA == 0 ? '../../rele/auth/auth' : '../../rele/auth2/auth2';
    wx.navigateTo({
      url: url
    })
  },
  rewaFn() {
    wx.navigateTo({
      url: '../../my/robs/robs'
    })
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