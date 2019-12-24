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
Page({
  data: {
    baseSrc: baseSrc,
    iss: '',
    mask: -1,
    is: true,
    payIs: true,

    pick1: ['新品促销', '尾货处理'],
    pickIdx1: 0,
    pickVal1: '请选择',

    pick2: ['单品折扣', '满送活动', '多产品打包价'],
    pickIdx2: 0,
    pickVal2: '请选择',


    pick3: ['否', '是'],
    pickIdx3: 0,
    pickVal3: '请选择',

    pick4: ['普票', '增值税', '不含税'],
    pickIdx4: 0,
    pickVal4: '请选择',


    photos: [],
    preview: [],
    ela: '',
    eye: 2,
    date: '请选择',

    isFocus: true,
    Value: ""
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
              setTimeout(function() {
                wx.switchTab({
                  url: '../../tabbar/home/home',
                })
              }, 1000);
              app.toast('发布成功', 'success')
            },
          })
        }
      });
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
                mask: -1
              });
              setTimeout(function() {
                wx.switchTab({
                  url: '../../tabbar/home/home',
                })
              }, 1000);
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
    const a = this.data.pickIdx1;
    const [b, c] = [this.data.bra, this.data.name];
    const [d, e] = [this.data.pickIdx2, this.data.num];
    const [f, g] = [this.data.pickIdx3, this.data.pickIdx4];
    const h = this.data.date;
    if (a === 0) {
      app.toast('请选择需求类型！')
      return;
    }
    if (!app.trim(b)) {
      app.toast('请输入产品品牌！')
      return;
    }
    if (!app.trim(c)) {
      app.toast('请输入产品名称！')
      return;
    }
    if (d === 0) {
      app.toast('请选择促销方式！')
      return;
    }
    if (!app.trim(e)) {
      app.toast('请输入活动总价！')
      return;
    }
    if (f === 0) {
      app.toast('请选择是否包邮！')
      return;
    }
    if (g === 0) {
      app.toast('请选择是否含税！')
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
    const data = {
      userid: app.globalData.uid,
      id: 0,
      type: 6,
      demandtype: a,
      brand: b,
      goodname: c,
      sale: d,
      price: e,
      postage: f,
      tax: g,
      btime: h,
      pic: str,
      overview: this.data.ela
    };
    const is = this.data.iss;
    if (is == 1) {
      this.setData({
        mask: 1
      })
    } else {
      this.decr(data)
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
      } else {
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
      let iss, mask; //1为个人 2为企业用户 3为诚企
      if (isA == 2) {
        iss = 2;
        mask = -1;
      } else if (isB == 1) {
        iss = 3;
        mask = -1;
      } else {
        iss = 1;
        mask = 1;
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