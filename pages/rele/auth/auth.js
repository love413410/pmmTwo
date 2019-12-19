const app = getApp();
const {
  _post,
  _get
} = require('../../../utils/http.js')
const {
  baseSrc,
  comp,
  upload,
  sqs,
  code,
  checkCode
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    popIs: false,
    one: `${baseSrc}upload.png`,
    two: `${baseSrc}upload.png`,
    ix: false,
    is: false,
    mask: false,
    counts:60,
    strName:'请选择',
    check: [{
        'id':1,
        'name': '工程商',
        'checked':false
    },
      {
        'id': 2,
        'name': '经销/代理',
        'checked': false
      },
      {
        'id': 3,
        'name': '租赁商',
        'checked': false
      },
      {
        'id': 4,
        'name': '厂家/其他',
        'checked': false
      }
    ],
    gettime: true
  },
  onLoad: function(options) {

  },
  popupFn(e) {
    const code = e.detail.code;
    if (code == -1) {
      app.toast("获取用户信息失败")
    } else if (code == 0) {
      const openId = e.detail.openId;
      app.globalData.openId = openId;
      wx.navigateTo({
        url: '../../login/login'
      })
    }
  },
  obtainCode() {
    let _this = this;
    const mobile = _this.data.phone;
    if (!app.trim(mobile) || !app.regmp(mobile)) {
      app.toast('请输入正确联系方式')
      return;
    }

    let counts = _this.data.counts;
    let intTime = setInterval(function () {
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
    _get(code, {
      mobile: mobile,
      type: 2
    }).then(res => {
      if (res.code = 1) {
        app.toast('验证码已发送');
      } else {
        app.toast('验证码发送失败');
      }
    })
  },
  valFn(e) {
    this.setData({
      [e.currentTarget.dataset.id]: e.detail.value
    })
  },

  // 上传图片
  upPhoto(e) {
    const c = e.currentTarget.dataset.id;
    const is = e.currentTarget.dataset.is;
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths[0];
        _this.uploadFn(tempFilePaths, c, is);
      }
    })
  },
  uploadFn(e, c, is) {
    const _this = this;
    wx.uploadFile({
      url: upload,
      filePath: e,
      name: 'file',
      formData: null,
      success(res) {
        var temp = [];
        const r = JSON.parse(res.data);
        if (r.code == -1) {
          app.toast("上传图片失败")
        } else if (r.code == 1) {
          _this.setData({
            [c]: r.content.data.url,
            [is]: true
          })
        }
      }
    })
  },


  subFn() {
    const _this=this;
    if (!app.globalData.is) {
      this.setData({
        popIs: true
      })
      return false;
    };
    const a = this.data.com;
    const b = this.data.oper;
    const c = this.data.phone;
    const ix = this.data.ix;
    const is = this.data.is;
    var strName = this.data.strName; 
    if (strName =='请选择') {
      app.toast('请选择至少一个公司类型！')
      return;
    }
    if (!app.trim(a) || !app.regex(a)) {
      app.toast('请输入正确的公司名称！')
      return;
    }
    if (!app.trim(b) || !app.regex(b)) {
      app.toast('请输入正确的运营人！')
      return;
    }
    if (!app.trim(c) || !app.regmp(c)) {
      app.toast('请输入正确联系方式')
      return;
    }
    if (!ix) {
      app.toast('请上传营业执照！')
      return;
    }
    if (!is) {
      app.toast('请上传授权书！')
      return;
    }
    const data = {
      userid: app.globalData.uid,
      type: this.data.strId,
      company: a,
      operation_people: b,
      operation_mobile: c,
      business_licence: this.data.one,
      warrant: this.data.two
    };
    _post(checkCode, {
      mobile: c,
      code: _this.data.code,
    }).then(res => {
      if (res.code == 1) {
        _post(comp, data).then(res => {
          if (res.code == -1) {
            app.toast('企业认证失败！')
          } else if (res.code == 1) {
            app.toast('提交成功', 'success');
            setTimeout(function () {
              wx.navigateBack({
                detail: 1
              })
            }, 1000);
          } else {
            app.toast(res.msg)
          }
        })

        
      } else {
        app.toast(res.msg);
      };
    })
  },
  move(e) {
    this.setData({
      mask: false
    })
  },
  moves(e) {
    this.setData({
      mask: true
    })
  },
  checkboxChange: function (e) {
    const arr = e.detail.value;
    const check = this.data.check;
    if(arr.length>2){
      arr.splice(0,1);
      for (let c = 0; c < check.length; c++){
        check[c].checked = false;
      }
      for(let a=0;a<arr.length;a++){
        for(let c=0;c<check.length;c++){
          if (arr[a] == check[c].id){
            check[c].checked=true;
          }
        }
      };
      this.setData({
        check: check,
        arr: arr
      })
    }else{
      this.setData({
        arr: arr
      })
    }
  },
  comp(){
    const arr = this.data.arr.sort();
    const check = this.data.check;
    if (arr.length <1) {
      app.toast('请至少选择一个公司类型！');
      return
    }
    var strId = '',
      strName = '';
    for (let a = 0; a < arr.length; a++) {
      for (let c = 0; c < check.length; c++) {
        if (arr[a] == check[c].id) {
          strName+=check[c].name+',';
          strId += check[c].id + ',';
        }
      }
    };
    this.setData({
      strName: strName.substring(0, strName.length - 1),
      strId: strId.substring(0, strId.length - 1),
      mask: false
    })
  },
  
  onShareAppMessage: function() {

  }
})