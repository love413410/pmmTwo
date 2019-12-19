const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js')
const {
  baseSrc,
  spec,
  specialListNew,
  dispatch,
  myDeta
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    mask: false,
    user: [],
    page: 1,
    pagesize: 20,
    list: [],
    checked:[],
    is:true
  },
  onLoad: function(o) {
    if(o.t==1){
      const id = o.id;
      wx.setStorageSync('is', 'true');
      app.globalData.is = wx.getStorageSync('is') ? true : false;
      app.globalData.uid = id;
    }
  },
  onShow:function(){
    this.setData({
      page: 1,
      list: [],
    })
    this.spec();
  },
  spec() {
    const _this = this;
    _get(spec, {
      userid: app.globalData.uid,
      page: this.data.page,
      pagesize: this.data.pagesize,
      type:1
    }).then(res => {
      if (res.code == 1) {
        const list = res.content.list;
        _this.setData({
          list: [..._this.data.list, ...list]
        })
      }
    })
  },
  checkboxChange: function(e) {
    this.setData({
      checked: e.detail.value
    })
  },
  move() {
    this.setData({
      mask: false
    })
  },
  rotTo(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../sendData/sendData?to=1&id='+id
    })
  },
  myDeta(e) {
    const _this = this;
    const id = e.currentTarget.dataset.id;
    _get(myDeta, {
      userid: app.globalData.uid
    }).then(res => {
      if(res.code==1){
        const cityId = res.content.user.province;
        _this.send(id, cityId)
      }
    })
  },
  send(id, cityId) {
    this.setData({
      is: true
    });
    const _this = this;
    _get(specialListNew, {
      province: cityId
    }).then(res => {
      if (res.code == 1) {
        const user = res.content.list;
        const temp = [];
        for (let i = 0; i < user.length; i++) {
          var obj = {
            name: user[i].nickname,
            id: user[i].id,
            checked: false
          }
          temp.push(obj);
        }
        _this.setData({
          user: temp,
          mask: true,
          id: id
        })
      }
    })
  },
  toRou() {
    const _this = this;
    const checked = this.data.checked;
    if (checked.length<=0){
      app.toast('请至少选择一个技术人员！')
      return;
    }
    const str = checked.join(',');
    const id=this.data.id;
    this.setData({
      is: false
    });
    _post(dispatch, {
      userids: str,
      id: id
    }).then(res => {
      if (res.code == 1) {
        app.toast(res.msg);
        setTimeout(function(){
          wx.redirectTo({
            url: '../send/send'
          })
        },1000)
      }
    })
  },
  onReachBottom: function() {
    const page = this.data.page;
    this.setData({
      page: page + 1
    })
    this.spec();
  },
  onShareAppMessage: function() {

  }
})