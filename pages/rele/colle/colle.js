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
  myDeta,
  pay,
  passwo
} = require('../../../utils/urls.js');
import util from '../../../utils/util.js';
Page({
  data: {
    baseSrc: baseSrc,
    iss: '',
    mask: -1,
    is: true,
    payIs: true,

    pick1: ['室内', '半户外', '户外'],
    pickIdx1: 0,
    pickVal1: '请选择',

    pick2: ['单色', '双基色', '全彩色'],
    pickIdx2: 0,
    pickVal2: '请选择',

    pick3: ['P10', 'P8', 'P6', 'P5', 'P4', 'P3', 'P2.5', 'P2', '其他'],
    pickIdx3: 0,
    pickVal3: '请选择',

    pick4: ['室内铝框（无包边）', '室内方管结构（无包边）', '户外结构（含铝塑板四圈包边）', '不需要'],
    pickIdx4: 0,
    pickVal4: '请选择',

    pick5: ['室内屏（接电源+控制卡+调试）', '户外屏（吊装+接电+调试）', '不需要'],
    pickIdx5: 0,
    pickVal5: '请选择',

    pick6: ['一年上门5次', '两年上门10次', '不需要'],
    pickIdx6: 0,
    pickVal6: '请选择',
    regStr: '选择省、市、区',
    photos: [],
    preview: [],
    ela: '',
    eye: 2,
    date: '请选择',

    isFocus: true,
    Value: "",
    isDis: false,
    releText: '立即发布'
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
      idd: e.detail.idd
    })
    this.getLocat()
  },
  // payIs
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
              setTimeout(function() {
                wx.switchTab({
                  url: '../../tabbar/home/home'
                })
              }, 1000);
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
        console.log(res)
        if (res.code == 1) {
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
              wx.switchTab({
                url: '../../tabbar/home/home'
              });
            }
            app.toast(res.msg)
          })
        } else {
          app.toast(res.msg)
        }
      })
    }
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

  move() {
    this.setData({
      mask: -1,
      Value: ''
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
  releFn() {
    if (util.clickFn()) return;
    const _this = this;
    const [a, b, c] = [this.data.pickIdx1, this.data.pickIdx2, this.data.pickIdx3];
    const [d, e, f] = [this.data.squ, this.data.con, this.data.mod];
    const [g, h] = [this.data.regStr, this.data.idtName];
    const [i, j, k] = [this.data.pickIdx4, this.data.pickIdx5, this.data.pickIdx6];
    const l = this.data.date;
    if (a === 0) {
      app.toast('请选择使用环境！')
      return;
    }
    if (b === 0) {
      app.toast('请选择显示颜色！')
      return;
    }
    if (c === 0) {
      app.toast('请选择产品型号！')
      return;
    }

    if (!app.trim(d)) {
      app.toast('请输入净屏面积！')
      return;
    }

    if (i === 0) {
      app.toast('请选择框架服务！')
      return;
    }
    if (j === 0) {
      app.toast('请选择屏体安装！')
      return;
    }
    if (k === 0) {
      app.toast('请选择维保服务！')
      return;
    }

    if (!app.trim(e) || !app.regex(e)) {
      app.toast('请输入正确的联系人！')
      return;
    }
    if (!app.trim(f) || !app.regmp(f)) {
      app.toast('请输入正确联系方式')
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
    if (l == '请选择') {
      app.toast('请选择截止时间！')
      return;
    }
    const photos = this.data.photos;
    var tempPic = [];
    for (let i = 0; i < photos.length; i++) {
      tempPic.push(photos[i].src)
    }
    const str = tempPic.join(',');
    const data = {
      userid: app.globalData.uid,
      id: 0,
      type: 2,
      ambient: a,
      colorshow: b,
      modelnumber: c,
      acreage: d,
      link: e,
      linkphone: f,
      province: this.data.idp,
      city: this.data.idc,
      area: this.data.idd,
      address: h,
      longitude: this.data.loc.lng,
      latitude: this.data.loc.lat,
      pic: str,
      overview: this.data.ela,
      service: i,
      install: j,
      maintain: k,
      btime: l
    };
    const is = this.data.iss;
    if (is == 1) {
      //1为个人,就提示去认证
      this.setData({
        mask: 1
      });
    } else if (is == 2) {
      this.decr(data)
    } else {
      _this.setData({
        isDis: true,
        releText: '发布中'
      })
      _post(decr, data).then(res => {
        if (res.code == 1) {
          wx.switchTab({
            url: '../../tabbar/home/home'
          })
          app.toast('发布成功', 'success')
        }else{
          app.toast(res.msg);
          _this.setData({
            isDis: false,
            releText: '立即发布'
          })
        }
      })
      //3为诚企,直接发布
    }

  },
  decr(data) {
    const _this = this;
    _post(decr, data).then(res => {
      if (res.code == 1) {
        _this.setData({
          payIs: false,
          taskid: res.content.taskid
        })
      }else{
        app.toast(res.msg)
      }
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
          mask = -1;
        } else {
          iss = 1;
          mask = 1;
        }
      } else {
        iss = 3;
        mask = -1;
      }
      _this.setData({
        isis: isA,
        iss: iss,
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