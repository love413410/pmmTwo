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
  pay,
  passwo,
  myDeta
} = require('../../../utils/urls.js');
import util from '../../../utils/util.js';
Page({
  data: {
    baseSrc: baseSrc,
    is: true,
    payIs: true,
    pick1: ['否', '是'],
    pickIdx1: 0,
    pickVal1: '请选择',

    pick2: ['普票', '增值税', '不含税'],
    pickIdx2: 0,
    pickVal2: '请选择',

    regStr: '选择省、市、区',
    photos: [],
    preview: [],
    date: '请选择',
    ela: '',
    eye: 2
  },
  onLoad: function(options) {

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
  payFn(e) {
    const _this = this;
    const val = e.detail;
    const taskid = this.data.taskid;
    if (val == 1) {
      _post(pay, {
        userid: app.globalData.uid,
        payType: 1,
        taskid: taskid
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
              wx.switchTab({
                url: '../../tabbar/home/home'
              })
              app.toast('发布成功', 'success')
            },
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
    } else if (val == -2) {
      wx.redirectTo({
        url: '../../my/detaSan/detaSan?id=' + taskid
      })
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
        password: this.data.Value,
      }).then(res => {
        if (res.code == 1) {
          wx.showLoading({
            title: '正在支付中'
          });
          const data = {
            userid: app.globalData.uid,
            payType: 2,
            taskid: this.data.taskid
          };
          _post(pay, data).then(res => {
            if (res.code == 1) {
              app.toast(res.msg);
              _this.setData({
                Value: '',
                inputValue: '',
                mask: -1
              });
              setTimeout(function() {
                wx.switchTab({
                  url: '../../tabbar/home/home'
                })
              }, 1000);
            };
            wx.hideLoading();
            app.toast(res.msg)
          })
        } else {
          app.toast(res.msg)
        }
      })
    }
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
    const [a, b, c, d] = [this.data.bra, this.data.name, this.data.mode, this.data.num];
    const [e, f, g] = [this.data.pickIdx1, this.data.pickIdx2, this.data.date];
    const [h, i] = [this.data.regStr, this.data.idtName];

    if (!app.trim(a)) {
      app.toast('请输入产品品牌！')
      return;
    }
    if (!app.trim(b)) {
      app.toast('请输入产品名称！')
      return;
    }
    if (!app.trim(c)) {
      app.toast('请输入产品型号！')
      return;
    }
    if (!app.trim(d)) {
      app.toast('请输入采购数量！')
      return;
    }
    if (e === 0) {
      app.toast('请选择是否包邮！')
      return;
    }
    if (f === 0) {
      app.toast('请选择是否含税！')
      return;
    }

    if (h == '选择省、市、区') {
      app.toast('请选择所在地区！')
      return;
    }
    if (!app.trim(i)) {
      app.toast('请填写详细地址')
      return;
    }
    if (h == '请选择') {
      app.toast('请选择截止时间！')
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
      type: 4,
      brand: a,
      goodname: b,
      modalnum: c,
      buynum: d,
      postage: e,
      tax: f,
      province: this.data.idp,
      city: this.data.idc,
      area: this.data.idd,
      address: i,
      longitude: this.data.loc.lng,
      latitude: this.data.loc.lat,
      btime: g,
      pic: str,
      overview: this.data.ela
    };
    const _this = this;
    _post(decr, data).then(res => {
      if (res.code == 1) {
        _this.setData({
          payIs: false,
          taskid: res.content.taskid
        })
      } else {
        app.toast(res.msg)
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
  move() {
    this.setData({
      mask: -1,
      Value: ''
    })
  },
  onShow: function() {
    this.myDeta();
    const date = new Date();
    const nowTime = date.getTime();
    const ms = 24 * 3600 * 1000 * +1;
    date.setTime(parseInt(nowTime + ms));
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
  onShareAppMessage: function() {

  }
})