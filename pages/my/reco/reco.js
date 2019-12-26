const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js')
const {
  baseSrc,
  passwo,
  compan,
  getCity,
  comCall,
  myDeta,
  freeLook
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    leve: true,
    city: '未知',
    qiye:'企业类型',
    pick1: [
      {
        name: '全部',
        type: '5'
      },
      {
        name: '工程商',
        type: '1'
      },
      {
        name: '经销/代理',
        type: '2'
      },
      {
        name: '租赁商',
        type: '3'
      },
      {
        name: '其他',
        type: '4'
      }
    ],
    pickIdx1: 0,

    pick2: [{
        name: '好评优先',
        type: '1'
      },
      {
        name: '距离优先',
        type: '2'
      }
    ],
    pickIdx2: 0,
    page: 1,
    pagesize: 20,
    sort: 1,
    list: [],
    payIs: true
  },
  onLoad: function(options) {
    this.getLoca();
  },
  onShow: function() {
    const _this = this;
    _get(myDeta, {
      userid: app.globalData.uid
    }).then(res => {
      const user = res.content.user;
      _this.setData({
        user: user
      })
    })
  },
  pickFn(e){
    this.setData({
      [e.currentTarget.dataset.idx]: e.detail.value,
      list: [],
      page: 1
    });
    this.compans()
  },
  pickFn1(e) {
    this.setData({
      [e.currentTarget.dataset.idx]: e.detail.value,
      qiye: this.data.pick1[e.detail.value].name,
      list: [],
      page: 1
    });
    this.compans()
  },
  idFn(e) {
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
    this.compans();
  },
  authFn() {
    this.setData({
      mask: 1
    })
  },
  rouTo(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },
  compans() {
    const _this = this;
    const cid = this.data.idc == '' ? this.data.idp : this.data.idc;
    const data = {
      userid: app.globalData.uid,
      page: this.data.page,
      pagesize: this.data.pagesize,
      type: this.data.pick1[this.data.pickIdx1].type,
      sort: this.data.pick2[this.data.pickIdx2].type,
      lat: this.data.loc.lat,
      lng: this.data.loc.lng
    };
    if (this.data.idc){
      data.city = cid
    }else{
      data.province = cid
    }
    _get(compan, data).then(res => {
      if (res.code == 1) {
        const list = res.content.list;
        _this.setData({
          list: [..._this.data.list, ...list]
        })
      }
    })
  },
  free(e) {
    const _this = this;
    const id = e.currentTarget.dataset.id;
    _post(freeLook, {
      userid: app.globalData.uid,
      id: id
    }).then(res => {
      if (res.code == 1) {
        if (res.code == 1) {
          _this.setData({
            page: 1,
            list: []
          })
          _this.compans();
        }
      }
    })
  },
  callFn(e){
    const phone = e.currentTarget.dataset.num;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  look(e) {
    this.setData({
      payIs: false,
      id: e.currentTarget.dataset.id
    })
  },
  payFn(e) {
    const _this = this;
    const val = e.detail;
    const taskid = this.data.id;
    if (val == 1) {
      _post(comCall, {
        userid: app.globalData.uid,
        payType: 1,
        approveid: taskid
      }).then(res => {
        if (res.code == 1) {
          const msg = res.content.data.msg;
          wx.requestPayment({
            timeStamp: msg.timeStamp,
            nonceStr: msg.nonceStr,
            package: msg.package,
            signType: msg.signType,
            paySign: msg.paySign,
            success(res) {
              _this.setData({
                list: [],
                page: 1
              })
              setTimeout(_this.compans, 500);
            }
          })
        }
      })
    } else if (val == 2) {
      this.setData({
        mask: 2,
        isFocus: true
      })
    } else if (val == -1) {
      app.toast('暂未设置支付密码！')
    }
  },
  Focus(e) {
    var _this = this;
    var inputValue = e.detail.value;
    var ilen = inputValue.length;
    this.setData({
      Value: inputValue,
    })
    if (ilen == 6) {
      _get(passwo, {
        userid: app.globalData.uid,
        password: _this.data.Value,
      }).then(res => {
        if (res.code == 1) {
          _post(comCall, {
            userid: app.globalData.uid,
            payType: 2,
            approveid: _this.data.id
          }).then(res => {
            if (res.code == 1) {
              this.setData({
                list: [],
                page: 1,
                mask: -1,
                Value: ''
              })
              setTimeout(_this.compans, 500);
            }
            app.toast(res.msg)
          })
        } else {
          app.toast(res.msg)
        }
      })
    }
  },
  move() {
    this.setData({
      mask: -1,
      Value: ''
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
        city: res.result.address_component.city,
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
        idc: idcId,
        list: [],
        page: 1
      })
      _this.compans()
    })
  },
  onReachBottom: function() {
    const page = this.data.page;
    this.setData({
      page: page + 1
    })
    this.compans()
  },
  preview(e) {
    const item = e.currentTarget.dataset.item;
    const btn = item.btn_type;
    if (btn!=2){
      return false;
    };
    const arr = [item.business_licence];
    wx.previewImage({
      current: item.business_licence,
      urls: arr
    })
  },
  onShareAppMessage: function() {

  }
})