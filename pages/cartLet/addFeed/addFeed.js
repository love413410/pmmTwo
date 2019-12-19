const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js')
const {
  baseSrc,
  getCity,
  upload,
  feedback
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    regStr: "上传位置",
    preview: [],
    pic: [],
    voucher: [],
    val: '',
    desc: ''
  },
  upPhoto(e) {
    const type = e.currentTarget.dataset.type;
    var _this = this;
    wx.chooseImage({
      count: 5,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths;
        for (let i = 0; i < tempFilePaths.length; i++) {
          _this.uploadFn(tempFilePaths[i], type)
        }
      }
    })
  },
  uploadFn(url, type) {
    const _this = this;
    wx.uploadFile({
      url: upload,
      filePath: url,
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
          const pic = [..._this.data[type], ...temp];
          const img = [..._this.data.preview, ...picTemp];
          _this.setData({
            [type]: pic,
            preview: img
          })
        }
      }
    })
  },
  // 删除图片
  showDel(e) {
    const type = e.currentTarget.dataset.type;
    var cid = e.currentTarget.dataset.cid;
    var str = type + '[' + cid + '].del';
    this.setData({
      [str]: true
    });
  },
  delPhoto(e) {
    var cid = e.currentTarget.dataset.cid;
    var picArr = this.data[e.currentTarget.dataset.type];
    picArr.splice(cid, 1);
    this.setData({
      [e.currentTarget.dataset.type]: picArr
    });
  },
  preview(e) {
    const _this = this;
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: _this.data.preview
    })
  },
  valFn(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      [type]: e.detail.value
    })
  },
  subBtn() {
    const a = this.data.regStr;
    const b = this.data.pic;
    const c = this.data.voucher;
    const d = this.data.val;
    const e = this.data.desc;
    if (a == '上传位置') {
      app.toast('请上传位置！')
      return;
    }
    if (b.length < 1) {
      app.toast('请上传图片！')
      return;
    }
    if (!app.trim(d)) {
      app.toast('请输入报销费用！')
      return;
    }
    var pic = this.data.pic;
    var tempPic = [];
    for (let i = 0; i < pic.length; i++) {
      tempPic.push(pic[i].src)
    }
    var pic = tempPic.join(',');

    var img = this.data.voucher;
    var tempImg = [];
    for (let i = 0; i < img.length; i++) {
      tempImg.push(img[i].src)
    }
    var img = tempImg.join(',');
    var data = {
      userid: app.globalData.uid,
      taskid: this.data.id,
      province: this.data.idp,
      city: this.data.idc,
      area: this.data.idd,
      address: this.data.address,
      pics: pic,
      fee: this.data.val,
      warrant: img,
      des: this.data.desc
    };
    _post(feedback, data).then(res => {
      if (res.code == -1) {
        app.toast(res.msg + '！')
      } else if (res.code == 1) {
        app.toast(res.msg + '！');
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        }, 1000);
      }
    })
  },
  onLoad: function(o) {
    this.setData({
      id: o.id
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
      _this.getLocal(loc)
    })
  },
  // 经纬度转换成城市
  getLocal(loc) {
    const _this = this;
    app.getLocal(loc).then(res => {
      const data = res.result.address_component;
      _this.setData({
        regStr: `${data.province}${data.city}${data.district}${data.street_number}`,
        address: data.street_number
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
  onShareAppMessage: function() {

  }
})