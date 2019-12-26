const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js')
const {
  baseSrc,
  myDeta,
  modiUser,
  upload,
  code,
  checkCode,
  getCity
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    avatar: `${baseSrc}face1.png`,
    name: '',
    phone: '',
    regionStr: '请选择',
    is: true,
    idp: '',
    idc: '',
    idd: '',
    gettime: true,
    code: '',
    counts: 60,
    setCount: '',
    isCode: true
  },
  onLoad: function(options) {
    this.myDeta()
  },
  myDeta() {
    const _this = this;
    const data = {
      userid: app.globalData.uid
    };
    _get(myDeta, data).then(res => {
      if (res.code == -1) {
        app.toast('获取个人信息失败')
      } else {
        const user = res.content.user;
        _this.setData({
          avatar: user.avatar,
          name: user.nickname,
          sex: user.gender,
          date: user.birthday,
          phone: user.mobile,
          temp: user.mobile,
          regionStr: `${user.provincename}${user.cityname}${user.areaname}`,
          idp: user.province,
          idc: user.city,
          idd: user.area
        });
        if (user.provincename == '' && user.cityname == '' && user.areaname==''){
          _this.getLoca()
        }
      }
    })
  },
  inpt(e) {
    const key = e.currentTarget.dataset.id;
    const val = e.detail.value;
    this.setData({
      [key]: val
    })
  },
  isFn() {
    this.setData({
      isCode: false
    })
  },
  linkShow() {
    this.setData({
      is: false
    })
  },
  linkFn(e) {
    this.setData({
      regionStr: e.detail.val,
      idp: e.detail.idp,
      idc: e.detail.idc,
      idd: e.detail.idd,
    })
  },
  chooseFace(e) {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths[0];
        _this.upload(tempFilePaths)
      }
    })
  },
  upload(e) {
    const _this = this;
    wx.uploadFile({
      url: upload,
      filePath: e,
      name: 'file',
      formData: null,
      success(res) {
        const r = JSON.parse(res.data);
        if (r.code == -1) {
          app.toast("上传图片失败")
        } else if (r.code == 1) {
          _this.setData({
            avatar: r.content.data.url
          });
        }
      }
    })
  },
  save() {
    const _this = this;
    const temp = this.data.temp;
    const mobile = this.data.phone;
    if (temp != mobile) {
      _post(checkCode, {
        mobile: mobile,
        code: _this.data.code,
      }).then(res => {
        if (res.code == 1) {
          _this.prese()
        } else {
          app.toast(res.msg);
        };
      })
    } else {
      _this.prese()
    }
  },
  prese() {
    const _this=this;
    const regionStr = this.data.regionStr;
    app.getLocat(regionStr).then(res => {
      const data = {
        userid: app.globalData.uid,
        mobile: this.data.phone,
        avatar: this.data.avatar,
        nickname: this.data.name,
        province: this.data.idp,
        city: this.data.idc,
        area: this.data.idd,
        longitude: res.lng,
        latitude: res.lat
      };
      const name = this.data.name;
      const mobile = this.data.phone;
      if (!app.trim(name)) {
        app.toast('请输入姓名')
        return
      };
      if (mobile.length > 0) {
        if (!(/^1[3456789]\d{9}$/.test(mobile))) {
          app.toast('请输入正确的手机号')
          return
        }
      };
      _post(modiUser, data).then(r => {
        if (r.code == -1) {
          app.toast('修改信息失败')
        } else {
          app.toast(r.msg)
          setTimeout(_this.back,2000);
        }
      })
    })
  },
  back(){
    wx.navigateBack({delta: 1})
  },
  obtainCode() {
    let _this = this;
    const mobile = _this.data.phone;
    if (!app.trim(mobile) || !app.regmp(mobile)) {
      app.toast('请输入正确联系方式')
      return;
    }
    _get(code, {
      mobile: mobile,
      type:1
    }).then(res => {
      if (res.code = 1) {
        let counts = _this.data.counts;
        let intTime = setInterval(function() {
          counts--;
          if (counts > 0) {
            _this.setData({
              gettime: false,
              codeText: counts + "s"
            });
          } else {
            clearInterval(intTime);
            _this.setData({
              counts: 60,
              gettime: true,
              codeText: ""
            });
          }
        }, 1000);
      } else {
        app.toast('验证码发送失败');
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
      _this.setData({
        loc: loc
      })
      _this.getLocal()
    })
  }, 
  getLocal() {
    const _this = this;
    app.getLocal(this.data.loc).then(res => {
      const result = res.result.address_component;
      _this.setData({
        regionStr: `${result.province}${result.city}${result.district}`
      })
      const idpName = result.province;
      const idcName = result.city;
      const iddName = result.district;
      _this.getCity('idp', idpName);
      _this.getCity('idc', idcName);
      _this.getCity('idd', iddName);
    })
  },
  getCity(x,e) {
    const _this = this;
    _get(getCity, {
      name: e
    }).then(res => {
      const idcId = res.content.detail[0].region_id;
      _this.setData({
        [x]: idcId
      })
    })
  },
  onShareAppMessage: function() {

  }
})