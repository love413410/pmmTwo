const app = getApp();
const {
  _post,
  _get
} = require('../../../utils/http.js')
const {
  baseSrc,
  pay,
  getCity,
  upload,
  decr,
  decrDeta, 
  myDeta
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    is: true,
    mask: -1,
    is: true,
    payIs: true,

    pick1: ['室内', '半户外', '户外'],
    pickIdx1: '',

    pick2: ['单色', '双基色', '全彩色'],
    pickIdx2: '',

    pick3: ['P10', 'P8', 'P6', 'P5', 'P4', 'P3', 'P2.5', 'P2', '其它'],
    pickIdx3: '',

    pick4: ['新品促销', '尾货处理'],
    pickIdx4: '',

    pick5: ['室内铝框（无包边）', '室内方管结构（无包边）', '户外结构（含铝塑板四圈包边）', '不需要'],
    pickIdx5: '',

    pick6: ['室内屏（接电源+控制卡+调试）', '户外屏（吊装+接电+调试）', '不需要'],
    pickIdx6: '',

    pick7: ['一年上门5次', '两年上门10次', '不需要'],
    pickIdx7: '',

    pick8: ['单品折扣', '满送活动', '多产品打折'],
    pickIdx8: '',


    pick9: ['否', '是'],
    pickIdx9: '',

    pick10: ['普票', '增值税', '不含税'],
    pickIdx10: '',

    regStr: '选择省、市、区',
    photos: []
    

  },
  onLoad: function(o) {
    const _this = this;
    _get(decrDeta, {
      userid: app.globalData.uid,
      id: o.id,
      source: 1
    }).then(res => {
      const task = res.content.task;
      const type = task.type;
      const loc = {
        lat: task.latitude,
        lng: task.longitude
      }
      var picStr = type == 4 ? '样品图片' : type == 6 ? '产品图片' : '现场实图';
      const pics = task.pics;
      var tempPic=[];
      for(let i=0;i<pics.length;i++){
        var obj = {
          del: false,
          src: pics[i]
        };
        tempPic.push(obj)
      }
      this.setData({
        id:task.id,
        type: type,
        pickIdx1: task.ambient,
        pickIdx2: task.colorshow,
        pickIdx3: task.modelnumber,
        pickIdx4: task.demandtype,
        pickIdx5: task.service,
        pickIdx6: task.install,
        pickIdx7: task.maintain,
        pickIdx8: task.sale,
        pickIdx9: task.postage,
        pickIdx10: task.tax,
        
        goodname: task.goodname,
        bra: task.brand,
        mode: task.modalnum,
        estPx: task.acreage,
        
        price: task.price,
        num: task.buynum,
        
        con: task.link,
        mod: task.linkphone,
        idtName: task.address,
        loc: loc,
        idp: task.province,
        idc: task.city,
        idd: task.area,
        picStr: picStr,
        regStr: `${task.provincename}${task.cityname}${task.areaname}`,
        date: task.btime,
        photos: tempPic,
        ela: task.overview
      })
    })
  },
  pickFn(e) {
    this.setData({
      [e.currentTarget.dataset.idx]: e.detail.value
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
        const r = JSON.parse(res.data);
        if (r.code == -1) {
          app.toast("上传图片失败")
        } else if (r.code == 1) {
          var obj = {
            del: false,
            src: r.content.data.url
          }
          temp.push(obj)
          const pic = [..._this.data.photos, ...temp]
          _this.setData({
            photos: pic
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

  releFn(){
    const type = this.data.type;
    type == 2 ? this.collFn() : type == 4 ?this.counFn():this.newFn();
    
  },
  collFn(){
    let [a, b, c] = [this.data.pickIdx1, this.data.pickIdx2, this.data.pickIdx3];
    let d = this.data.estPx;
    let [e, f, g] = [this.data.pickIdx5, this.data.pickIdx6, this.data.pickIdx7];
    let [h, i, j] = [this.data.con, this.data.mod, this.data.idtName];
    if (!app.trim(d)){
      app.toast('请输入净屏面积！')
      return;
    }
    if (!app.trim(h) || !app.regex(h)) {
      app.toast('请输入正确的联系人！')
      return;
    }
    if (!app.trim(i) || !app.regmp(i)) {
      app.toast('请输入正确联系方式')
      return;
    }
    if (!app.trim(j)) {
      app.toast('请填写详细地址！')
      return;
    }
    const photos = this.data.photos;
    var tempPic = [];
    for (let i = 0; i < photos.length; i++) {
      tempPic.push(photos[i].src)
    }
    const str = tempPic.join(',');
    var data={
      userid: app.globalData.uid,
      id: this.data.id,
      type: 2,
      ambient: a,
      colorshow: b,
      modelnumber: c,
      acreage:d,
      service: e,
      install: f,
      maintain: g,
      link: h,
      linkphone: i,
      province: this.data.idp,
      city: this.data.idc,
      area: this.data.idd,
      address: j,
      longitude: this.data.loc.lng,
      latitude: this.data.loc.lat,
      btime: this.data.date,
      pic: str,
      overview: this.data.ela,
    };
    this.myDeta();
    const is=this.data.iss;
    if(is==2){
      this.setData({
        mask:2
      })
    }else if(is==3){

      const _this = this;
      _post(pay, data).then(res => {
        if (res.code == 1) {
          _this.setData({
            payIs: false
          })
        }
      })


    }
  },
  counFn(){
    const [a, b, c, d] = [this.data.bra, this.data.goodname, this.data.mode, this.data.num];
    const [e, f] = [this.data.pickIdx9, this.data.pickIdx10];
    const [g, h] = [this.data.idtName, this.data.date];
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
    if (!app.trim(g)) {
      app.toast('请输入详细地址！')
      return;
    }
    const photos = this.data.photos;
    var tempPic = [];
    for (let i = 0; i < photos.length; i++) {
      tempPic.push(photos[i].src)
    }
    const str = tempPic.join(',');
    const data={
      userid: app.globalData.uid,
      id: this.data.id,
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
      address: g,
      longitude: this.data.loc.lng,
      latitude: this.data.loc.lat,
      btime: h,
      pic: str,
      overview: this.data.ela
    };
    _post(decr, data).then(res => {
      if (res.code !=1) {
        app.toast(res.msg)
      } else if (res.code == 1) {
        this.setData({
          payIs: false
        })
      }
    })
  },

  newFn(){
    const [a, b, c, d] = [this.data.pickIdx4, this.data.bra, this.data.goodname, this.data.pickIdx8];
    const [e, f, g, h] = [this.data.price, this.data.pickIdx9, this.data.pickIdx10, this.data.date];
    if (!app.trim(b)) {
      app.toast('请输入产品品牌！')
      return;
    }
    if (!app.trim(c)) {
      app.toast('请输入产品名称！')
      return;
    }
    if (!app.trim(e)) {
      app.toast('请输入活动总价！')
      return;
    }
    const photos = this.data.photos;
    var tempPic = [];
    for (let i = 0; i < photos.length; i++) {
      tempPic.push(photos[i].src)
    }
    const str = tempPic.join(',');
    const data={
      userid: app.globalData.uid,
      id: this.data.id,
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
    }
    this.myDeta();
    const is = this.data.iss;
    if (is == 2) {
      this.setData({
        mask: 2
      })
    } else if (is == 3) {
      _post(decr, data).then(res => {
        
        if (res.code != 1) {
          app.toast(res.msg)
        } else if (res.code == 1) {
          
          this.setData({
            payIs: false
          })
        }
      })
    }
    
  },
  payFn(e) {
    if (e.detail == 1) {
      const _this = this;
      _post(pay, {
        userid: app.globalData.uid,
        payType: 1,
        taskid: this.data.id
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
              app.toast('发布成功', 'success');
              wx.navigateBack({
                delta: 1
              })
            },
          })
        }
      })
    } else if (e.detail == 2) {
      this.setData({
        mask: 2,
        isFocus: true
      })
    } else {
      app.toast('暂未设置支付密码！')
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
            taskid: this.data.id
          };
          _post(pay, data).then(res => {
            if (res.code == 1) {
              app.toast(res.msg);
              _this.setData({
                Value: '',
                inputValue: '',
                mask: -1
              });
              wx.navigateBack({
                delta: 1
              })
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
      mask: -1
    })
  },

  auth() {
    wx.navigateTo({
      url: '../auth/auth'
    });
  },
  onShow:function(){
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
    const _this = this;
    _get(myDeta, {
      userid: app.globalData.uid
    }).then(res => {
      const isA = res.content.user.is_approve;
      const isB = res.content.user.is_vip;
      let iss, mask; //1为个人 2为企业用户 3为诚企
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
        iss: iss,
        mask: mask
      })
    })
  },
  onShareAppMessage: function() {

  }
})