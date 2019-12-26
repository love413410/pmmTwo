const app = getApp();
const {
  _post,
  _get
} = require('../../../utils/http.js')
const {
  baseSrc,
  decr,
  getCity,
  upload,
  myDeta
} = require('../../../utils/urls.js');
import util from '../../../utils/util.js';
Page({
  data: {
    baseSrc: baseSrc,
    is: true,
    pick1: ['室内', '户外'],
    pickIdx1: 0,
    pickVal1: '请选择',

    pick2: ['P4.81', 'P3.91', 'P4', 'P3', 'P2.5', 'P2', 'P1.9', '求推荐'],
    pickIdx2: 0,
    pickVal2: '请选择',

    pick3: ['活动典礼', '酒店会议或婚庆', '演唱会现场'],
    pickIdx3: 0,
    pickVal3: '请选择',

    regStr: '选择省、市、区',
    photos: [],
    preview: [],
    ela:'',
    eye: 2,
    date: '请选择',
    isDis: false,
    releText: '立即发布'
  },
  onLoad: function (options) {
    
  },
  pickFn(e) {
    this.setData({
      [e.currentTarget.dataset.idx]: e.detail.value,
      [e.currentTarget.dataset.val]: this.data[e.currentTarget.dataset.pick][
        [e.detail.value]
      ]
    })
  },
  dateFn(e) {
    this.setData({
      date: e.detail.value
    })
  },
  valFn(e) {
    const key = e.currentTarget.dataset.val;
    const val = e.detail.value;
    this.setData({
      [key]: val
    })
  },
  elaFn(e) {
    const val = e.detail.value;
    if (val.length > 50) {
      const ela = val.slice(0, 50);
      this.setData({
        ela: ela
      });
      app.toast('情况阐述字数请保持在50字以内！');
      return
    }
    this.setData({
      ela: val
    });
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
    this.getLocat()
  },
  upPhoto() {
    var _this = this;
    wx.chooseImage({
      count: 5,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths;
        for (let i = 0; i < tempFilePaths.length; i++) {
          _this.uploadFn(tempFilePaths[i])
        }
      }
    })
  },
  uploadFn(e) {
    const _this = this;
    wx.uploadFile({
      url: upload,
      filePath: e,
      name: 'file',
      formData: null,
      success(res) {
        var temp = [];
        var picTemp = [];
        const r = JSON.parse(res.data);
        if (r.code == -1) {
          app.toast("上传图片失败")
        } else if (r.code == 1) {
          var obj = {
            del: false,
            src: r.content.data.url
          }
          temp.push(obj);
          picTemp.push(r.content.data.url);
          const pic = [..._this.data.photos, ...temp];
          const img = [..._this.data.preview, ...picTemp];
          _this.setData({
            photos: pic,
            preview: img
          })
        }
      }
    })
  },
  showDel(e) {
    var cid = e.currentTarget.dataset.cid;
    var str = "photos[" + cid + "]del";
    this.setData({
      [str]: true
    });
  },
  delPhoto(e) {
    var cid = e.currentTarget.dataset.cid;
    var photos = this.data.photos;
    photos.splice(cid, 1);
    this.setData({
      photos: photos
    });
  },
  preview(e) {
    const _this = this;
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: _this.data.preview
    })
  },
  releFn() {
    if (util.clickFn()) return;
    const _this=this;
    const [a, b] = [this.data.pickIdx1, this.data.pickIdx2];
    const c = this.data.squ;
    const [d, e] = [this.data.pickIdx3, this.data.date];
    const [f, g, h] = [this.data.num, this.data.con, this.data.mod];
    const [i, j] = [this.data.regStr, this.data.idtName];
    if (a === 0) {
      app.toast('请选择使用环境！')
      return;
    }
    if (b === 0) {
      app.toast('请选择屏幕型号！')
      return;
    }
    if (!app.trim(c)) {
      app.toast('请输入预计面积！')
      return;
    }
    if (d === 0) {
      app.toast('请选择使用场景！')
      return;
    }
    if (e == '请选择') {
      app.toast('请选择使用日期！')
      return;
    }
    if (!app.trim(f)) {
      app.toast('请输入使用天数！')
      return;
    }
    if (!app.trim(g) || !app.regex(g)) {
      app.toast('请输入正确的联系人！')
      return;
    }
    if (!app.trim(h) || !app.regmp(h)) {
      app.toast('请输入正确联系方式')
      return;
    }
    if (i == '选择省、市、区') {
      app.toast('请选择所在地区！')
      return;
    }
    if (!app.trim(j)) {
      app.toast('请填写详细地址')
      return;
    }
    const photos = this.data.photos;
    var tempPic = [];
    for (let i = 0; i < photos.length; i++) {
      tempPic.push(photos[i].src)
    }
    const str = tempPic.join(',');
    const temp=a==1?2:a;
    const isis = this.data.isis;
    if (isis != 2) {
      this.setData({
        mask: 1
      })
      return false;
    };
    const data = {
      userid: app.globalData.uid,
      id:0,
      type: 5,
      ambient: temp,
      screen: b,
      acreage: c,
      scene:d,
      btime:e,
      usenum:f,
      link:g,
      linkphone: h,
      province: this.data.idp,
      city: this.data.idc,
      area: this.data.idd,
      address: j,
      longitude: this.data.loc.lng,
      latitude: this.data.loc.lat,
      pic: str,
      overview: this.data.ela
    };
    _this.setData({
      isDis: true,
      releText: '发布中'
    })
    _post(decr, data).then(res => {
      if (res.code == 1) {
        setTimeout(function () {
          wx.switchTab({
            url: '../../tabbar/home/home'
          })
        }, 1000);
        app.toast('发布成功', 'success')
      }else{
        app.toast(res.msg)
        _this.setData({
          isDis: false,
          releText: '立即发布'
        })
      }
    })
  },
  move() {
    this.setData({
      mask: -1
    })
  },
  auth() {
    var src = this.data.isis == 0 ? '../auth/auth' : '../auth2/auth2';
    this.setData({
      mask: -1
    });
    wx.navigateTo({
      url: src
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
      _this.setData({
        loc: loc
      })
      _this.getLocal()
    })
  },
  getLocal() {
    const _this = this;
    app.getLocal(this.data.loc).then(res => {
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
  getLocat() {
    const _this = this;
    app.getLocat(this.data.regStr).then(res => {
      const loc = {
        lat: res.lat,
        lng: res.lng,
      }
      _this.setData({
        loc: loc
      })
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
  onShow: function () {
    this.myDeta();
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const d = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate();
    this.setData({
      start: `${y}-${m}-${d}`
    })
  },
  myDeta() {
    _get(myDeta, {
      userid: app.globalData.uid
    }).then(res => {
      const isis = res.content.user.is_approve;
      var mask = isis == 2 ? mask = -1 : 1;
      this.setData({
        isis: isis,
        mask: mask
      })
    })
  },
  bindblurFn(e) {
    this.setData({
      eye: e.currentTarget.dataset.is
    })
  },
  onShareAppMessage: function () {

  }
})