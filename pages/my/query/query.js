const app = getApp();
const {
  _get
} = require('../../../utils/http.js')
const {
  baseSrc,
  mySpec,
  getCity
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    leve: true,
    city: '未知',
    page: 1,
    pagesize: 20,
    list:[],
    pick: ['卡莱特'],
    pickIdx: 0,
    pickVal: '卡莱特',
  },
  onLoad: function(options) {
    this.getLoca();
  },
  idFn(e) {
    this.setData({
      leve: false
    })
  },
  idpFn(e) {
    this.setData({
      idp: e.detail.idp,
      city: e.detail.val,
      list: [],
      page: 1
    })
    this.mySpec();
  },

  mySpec() {
    const _this = this;
    _get(mySpec, {
      type:'1',
      page: this.data.page,
      pagesize: this.data.pagesize,
      province: this.data.idp
    }).then(res => {
      if (res.code == 1) {
        const list = res.content.list;
        _this.setData({
          list: [..._this.data.list, ...list]
        })
      }
    })
  },
  callFn(e) {
    const phone = e.currentTarget.dataset.num;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  getLoca() {
    const _this = this;
    app.getLoca().then(res => {
      let lat = res.latitude;
      let lng = res.longitude;
      const loc = {
        lat: lat,
        lng: lng
      }
      this.setData({
        loc: loc
      })
      _this.getLocal(loc)
    })
  },
  getLocal(loc) {
    const _this = this;
    app.getLocal(loc).then(res => {
      _this.setData({
        city: res.result.address_component.province,
        list: [],
        page: 1
      })
      _this.getCity()
    })
  },
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
      _this.mySpec()
    })
  },
  onShareAppMessage: function() {

  }
})