const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js')
const {
  baseSrc,
  sclist,
  scCall,
  myDeta,
  passwo,
  jBannerList
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    payIs: true,
    num: 1,
    tle: '',
    total_num: '',
    total_mon: '',
    list: [],
    isFocus: true,
    Value: "",
    score:0,
    is: false
  },
  onLoad: function(options) {
    this.list();
    this.myDeta();
    this.bannerList();
  },
  myDeta() {
    const _this = this;
    _get(myDeta, {
      userid: app.globalData.uid
    }).then(res => {
      const user = res.content.user;
      _this.setData({
        user: user,
        score: user.score
      })
    })
  },
  list() {
    const _this = this;
    _get(sclist).then(res => {
      if (res.code == 1) {
        const list = res.content.list;
        _this.setData({
          list: list
        })
      }
    })
  },
  bannerList(){
    const _this = this;
    _get(jBannerList).then(res => {
      const list = res.content.list;
      _this.setData({
        banner: list
      })
    })
  },
  purcFn(e) {
    if (!app.globalData.is) {
      this.setData({
        is: true
      })
      return false;
    };
    const item = e.currentTarget.dataset.item;
    const idx = e.currentTarget.dataset.idx;
    const str = `套餐${idx}(${item.score}积分-${item.price}元)`;
    this.setData({
      tle: str,
      item: item,
      total_num: item.score,
      total_mon: item.price,
      temp_num: item.score,
      temp_mon: item.price,
      mask: 1
    })
  },
  move() {
    this.setData({
      mask: -1,
      num: 1,
      tle: '',
      total_num: '',
      total_mon: '',
    })
  },
  reduFn() {
    var num = this.data.num;
    var temp_num = this.data.temp_num;
    var temp_mon = this.data.temp_mon;
    num > 1 ? num-- : num = 1;
    this.setData({
      num: num,
      total_num: temp_num * num,
      total_mon: temp_mon * num
    })
  },
  valFn(e) {
    const num = e.detail.value;
    var temp_num = this.data.temp_num;
    var temp_mon = this.data.temp_mon;
    this.setData({
      num: num,
      total_num: temp_num * num,
      total_mon: temp_mon * num
    })
  },
  addFn() {
    var num = this.data.num;
    var temp_num = this.data.temp_num;
    var temp_mon = this.data.temp_mon;
    num++;
    this.setData({
      num: num,
      total_num: temp_num * num,
      total_mon: temp_mon * num
    })
  },
  conFn() {
    const num = this.data.num;
    if (num <= 0) {
      app.toast('购买数量至少为1！')
      return false;
    } else {
      var temp_mon = this.data.temp_mon;
      this.setData({
        mask: -1,
        num: num,
        total_mon: temp_mon * num,
        payIs: false
      })
    }
  },
  payFn(e) {
    const _this = this;
    const val = e.detail;
    const item = this.data.item;
    if (val == 1) {
      const data={
        userid: app.globalData.uid,
        payType: 1,
        comboid: item.id,
        comnonum: this.data.num,
        price: this.data.total_mon
      };
      _post(scCall, data).then(res => {
        if (res.code == 1) {
          const msg = res.content.data.msg;
          wx.requestPayment({
            timeStamp: msg.timeStamp,
            nonceStr: msg.nonceStr,
            package: msg.package,
            signType: msg.signType,
            paySign: msg.paySign,
            success(res) {
              app.toast('支付成功', 'success');
              setTimeout(function () {
                wx.redirectTo({
                  url: '../../shopping/numDate/numDate'
                })
              }, 1000);
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
    }
  },
  Focus(e) {
    var _this = this;
    var inputValue = e.detail.value;
    var ilen = inputValue.length;
    const item = this.data.item;
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
            comboid: item.id,
            comnonum: this.data.num,
            price: this.data.total_mon
          };
          _post(scCall, data).then(res => {
            if (res.code == 1) {
              app.toast(res.msg);
              _this.setData({
                Value: '',
                inputValue: '',
                mask: -1
              });
              setTimeout(function () {
                wx.redirectTo({
                  url: '../../shopping/numDate/numDate'
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
  onShareAppMessage: function() {

  }
})