const app = getApp();
const {
  _post
} = require('../../../utils/http.js')
const {
  baseSrc,
  sugg,
  upload
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    val: '',
    photos: [],
    preview: [],
  },
  onLoad: function (o) {
    this.setData({
      t:o.t
    })
  },
  inpt(e) {
    this.setData({
      [e.currentTarget.dataset.id]: e.detail.value
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
      photos: photos,
      addHide: false
    });
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
          _this.upload(tempFilePaths[i])
        }
      }
    })
  },
  upload(e) {
    const _this = this;
    const leth = _this.data.photos.length;
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
  preview(e) {
    const _this = this;
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: _this.data.preview
    })
  },
  btn() {
    const val = app.trim(this.data.val);
    const phone = this.data.phone;
    const photos = this.data.photos;
    const temp = [];
    for (let i = 0; i < photos.length; i++) {
      temp.push(photos[i].src)
    }
    const pic = temp.join(',');
    if (!val) {
      app.toast('请输入你的建议')
      return
    }
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      app.toast('请输入正确的联系方式')
      return
    }
    const data = {
      content: this.data.val,
      userid: app.globalData.uid,
      phone: this.data.phone,
      pic: pic,
      type:this.data.t
    }
    _post(sugg, data).then(res => {
      if (res.code == -1) {
        app.toast('提交反馈失败!')
      } else {
        app.toast(res.msg);
        wx.navigateBack({
          detail: 1
        })
      }
    })
  },
  onShareAppMessage: function () {

  }
})