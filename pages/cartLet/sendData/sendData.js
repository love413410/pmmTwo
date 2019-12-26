const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js')
const {
  baseSrc,
  specialListNew,
  dispatch,
  decrDeta,
  getCity,
  comple,
  myDeta
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    mask: false,
    to: 0,
    user: [],
    checked: [],
    is: true
  },
  onLoad: function(o) {
    if(o.pid){
      this.setData({
        to: o.to,
        id: o.id,
        pid:o.pid,
        btn:o.btn,
        c:o.c
      })
    }else{
      this.setData({
        to: o.to,
        id: o.id
      })
    }
    this.decrDeta();
    this.getLoca();
  },
  decrDeta() {
    const _this = this;
    _get(decrDeta, {
      userid: app.globalData.uid,
      id: this.data.id
    }).then(res => {
      this.setData({
        task: res.content.task
      })
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
  preview(e) {
    const _this = this;
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: _this.data.task.pics
    })
  },
  myDeta(e) {
    const _this = this;
    const id = e.currentTarget.dataset.id;
    _get(myDeta, {
      userid: app.globalData.uid
    }).then(res => {
      if (res.code == 1) {
        const cityId = res.content.user.province;
        _this.send(id, cityId)
      }
    })
  },
  send(id, cityId) {
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
          mask: true
        })
      }

    })
  },
  
  toRou() {
    const _this = this;
    const checked = this.data.checked;
    if (checked.length <= 0) {
      app.toast('请至少选择一个技术人员！')
      return;
    }
    const str = checked.join(',');
    const id = this.data.id;
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
  rotTo() {
    wx.navigateBack({
      deteli: 1
    })
  },
  modeFn() {
    const _this = this;
    wx.showModal({
      title: '确认完成',
      content: '确认此订单已完成吗?',
      cancelColor: '#808080',
      confirmColor: '#fb7313',
      success(res) {
        if (res.confirm) {
          _post(comple, {
            userid: app.globalData.uid,
            id: _this.data.pid
          }).then(res => {
            if (res.code == 1) {
              wx.redirectTo({
                url: '../addFeed/addFeed?id=' + _this.data.id
              })
            }
          })
        }
      }
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
      _this.getLocal(loc)
    })
  },
  getLocal(loc) {
    const _this = this;
    app.getLocal(loc).then(res => {
      const city = res.result.address_component.province;
      _this.getCity(city)
    })
  },
  getCity(city) {
    const _this = this;
    _get(getCity, {
      name: city
    }).then(res => {
      const idcId = res.content.detail[0].region_id;
      _this.setData({
        cityId: idcId,
      })
    })
  },
  onShareAppMessage: function() {

  }
})