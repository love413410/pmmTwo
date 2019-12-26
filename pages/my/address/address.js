const app = getApp();
const {
  _post,
  _get
} = require('../../../utils/http.js')
const {
  baseSrc,
  getCity,
  addAddress,
  modiAddress,
  addressDetail
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    is: true,
    i:'',
    regStr: '选择省、市、区',
  },
  onLoad: function (o) {
    if(o.id){
      this.addDate(o.id)
    }
    if(o.i){
      this.setData({
        i:o.i
      })
    }
  },
  addDate(id){
    const _this=this;
    _get(addressDetail, {
      id: id
    }).then(res => {
      const data = res.content.data;
      _this.setData({
        con: data.sjr,
        mod: data.sjr_mobile,
        regStr: `${data.provincename}${data.cityname}${data.areaname}`,
        idtName: data.address,
        idp: data.province,
        idc: data.city,
        idd: data.area,
        id:data.id
      })
    })
  },
  link() {
    this.setData({
      is: false
    })
  },
  linkFn(e) {
    this.setData({
      regStr: e.detail.val,
      idp: e.detail.idp,
      idc: e.detail.idc,
      idd: e.detail.idd,
    })
  },
  valFn(e) {
    const key = e.currentTarget.dataset.val;
    const val = e.detail.value;
    this.setData({
      [key]: val
    });
  },
  send(){
    const _this=this;
    const [a, b] = [this.data.con, this.data.mod];
    const [c, d] = [this.data.regStr, this.data.idtName];
    if (!app.trim(a) || !app.regex(a)) {
      app.toast('请输入正确的收货人！')
      return;
    }
    if (!app.trim(b) || !app.regmp(b)) {
      app.toast('请输入正确联系方式')
      return;
    }
    if (c == '选择省、市、区') {
      app.toast('请选择所在地区！')
      return;
    }
    if (!app.trim(d)) {
      app.toast('请填写详细地址')
      return;
    }
    var data={
      userid: app.globalData.uid,
      sjr:a,
      sjr_mobile:b,
      province: this.data.idp,
      city: this.data.idc,
      area: this.data.idd,
      address: d,
    };
    const id=this.data.id;
    if (id){
      data.id=id;
      _post(modiAddress, data).then(res => {
        if (res.code == -1) {
          app.toast('修改地址失败！')
        } else if (res.code == 1) {
          setTimeout(function () {
            wx.navigateBack({
              delta:1
            })
          }, 1000);
          app.toast('修改地址成功', 'success')
        }
      })
    }else{
      _post(addAddress, data).then(res => {
        if (res.code == -1) {
          app.toast('保存地址失败！')
        } else if (res.code == 1) {
          const i=_this.data.i;
          if (i==1){
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1000);
          }else{
            setTimeout(function () {
              wx.redirectTo({
                url: '../myAddress/myAddress'
              })
            }, 1000);
          }
          app.toast('保存地址成功', 'success')
        }
      })
    }
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
      const data = res.result.address_component;
      _this.setData({
        regStr: `${data.province}${data.city}${data.district}`,
        idtName: data.street_number
      })
      _this.getCity('idp', data.province);
      _this.getCity('idc', data.city);
      _this.getCity('idd', data.district);
    })
  },
  getCity(u, d) {
    const _this = this;
    _get(getCity, {
      name: d
    }).then(res => {
      const id = res.content.detail[0].region_id;
      _this.setData({
        [u]: id
      })
    })
  },

  onShareAppMessage: function () {

  }
})