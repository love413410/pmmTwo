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
Page({
  data: {
    baseSrc: baseSrc,
    is: true,
    pick: ['卡莱特'],
    pickIdx: 0,
    pickVal: '请选择',


    pick1: ['发送端', '接收端', '其他', ],
    pickIdx1: 0,
    pickVal1: '请选择',

    pick2: ['现场调试支持', '公司技术培训', '其他'],
    pickIdx2: 0,
    pickVal2: '请选择',

    regStr: '选择省、市、区',
    photos: [],
    preview: [],
    ela: '',
    eye: 2,
    date: '请选择',
    isDis: false,
    releText: '立即发布'
  },
  onLoad: function (options) {
    
  },
  onShow: function (options) {
    this.myDeta();
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
  // 上传图片
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
  // 删除图片
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
  //发布
  releFn() {
    const _this = this;
    const z = this.data.pickIdx;
    const [a, b] = [this.data.name, this.data.px];
    const [c, d] = [this.data.pickIdx1, this.data.pickIdx2];
    const [e, f] = [this.data.con, this.data.mod];
    const [g, h] = [this.data.regStr, this.data.idtName];
    if (z === 0) {
      app.toast('请选择预约厂家！')
      return;
    }
    if (!app.trim(a)) {
      app.toast('请输入公司名称！')
      return;
    }
    var regPx = /^\d{1,}\*\d{1,}$/;
    if (!regPx.test(b)) {
      app.toast('请输入正确的屏幕像素！')
      return;
    }
    if (c === 0) {
      app.toast('请选择服务产品！')
      return;
    }
    if (d === 0) {
      app.toast('请选择服务形式！')
      return;
    }
    if (!app.trim(e) || !app.regex(e)) {
      app.toast('请输入正确的联系人！')
      return;
    }
    if (!app.trim(f) || !app.regmp(f)) {
      app.toast('请输入正确联系方式！')
      return;
    }
    if (g == '选择省、市、区') {
      app.toast('请选择所在地区！')
      return;
    }
    if (!app.trim(h)) {
      app.toast('请填写详细地址！')
      return;
    }
    const photos = this.data.photos;
    var tempPic = [];
    for (let i = 0; i < photos.length; i++) {
      tempPic.push(photos[i].src)
    }
    const str = tempPic.join(',');
    const isis = this.data.isis;
    if (isis != 2) {
      this.setData({
        mask: 1
      })
      return false;
    };
    const data = {
      userid: app.globalData.uid,
      id: 0,
      type: 7,
      brand: this.data.pickVal,
      goodname: a,
      screenpx: b,
      good: c,
      goodtype: d,
      link: e,
      linkphone: f,
      province: this.data.idp,
      city: this.data.idc,
      area: this.data.idd,
      address: h,
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
        setTimeout(function() {
          wx.switchTab({
            url: '../../tabbar/home/home'
          })
        }, 1000);
        app.toast('发布成功', 'success')
      } else {
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
      mask:-1
    });
    wx.navigateTo({
      url: src
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
  // 城市转换成经纬度
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

  /*
    获取城市的ID
  */
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
  bindblurFn(e) {
    this.setData({
      eye: e.currentTarget.dataset.is
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
  onShareAppMessage: function() {

  }
})