const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js');
const {
  baseSrc,
  myRob,
  discuss,
  comple,
  robPay,
  passwo
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    idx: 1,
    page: 1,
    pagesize: 20,
    list: [],
    sub: 0,
    isTrue: 1,
    good:1,
    payIs: true
  },
  onLoad: function(options) {

  },
  headFn(e) {
    const idx = e.currentTarget.dataset.idx;
    this.setData({
      idx: idx,
      list: [],
      page: 1,
      sub: 0
    })
    this.myRob()
  },
  subFn(e) {
    this.setData({
      sub: e.currentTarget.dataset.sub,
      list: [],
      page: 1
    });
    this.myRob()
  },
  onShow: function() {
    this.setData({
      page: 1,
      pagesize: 20,
      list: [],
      isTrue: 1
    })
    this.myRob()
  },
  myRob() {
    const _this = this;
    const type = this.data.idx;
    const data = {
      userid: app.globalData.uid,
      page: this.data.page,
      pagesize: this.data.pagesize,
      type: this.data.idx,
      status: this.data.sub
    };
    if (type == 1) {
      delete data.status;
    }
    _get(myRob, data).then(res => {
      const list = res.content.list;
      _this.setData({
        list: [..._this.data.list, ...list],
        ztotal: res.content.ztotal,
        wtotal: res.content.wtotal,
        ytotal: res.content.ytotal
      })
    })
  },
  swtaImg(e) {
    this.setData({
      isTrue: e.currentTarget.dataset.t
    })
  },
  r_subFn() {
    _post(discuss, {
      userid: app.globalData.uid,
      type: this.data.isTrue,
      id: this.data.id,
      source: 1
    }).then(res => {
      app.toast(res.msg);
      this.setData({
        mask: -1,
        isTrue: 1,
        list: [],
        page: 1
      });
      this.myRob();
    })
  },
  rouTo(e) {
    const id = e.currentTarget.dataset.id;
    const ty = e.currentTarget.dataset.ty;
    const is = e.currentTarget.dataset.go;
    let src;
    switch (ty) {
      case '1':
        src = '../../home/releDeta/releDeta?t=0&id=' + id;
        break;
      case '2':
        src = '../../home/colleDeta/colleDeta?t=0&id=' + id;
        break;
      case '3':
        src = '../../home/whoDeta/whoDeta?t=0&id=' + id + '&is=' + is;
        break;
      case '4':
        src = '../../home/couDeta/couDeta?t=0&id=' + id;
        break;
      case '5':
        src = '../../home/leaDeta/leaDeta?t=0&id=' + id;
        break;
      default:
        src = '../../home/newDeta/newDeta?t=0&id=' + id + '&is=' + is;
    }
    wx.navigateTo({
      url: src
    })
  },
  move(e) {
    const x = e.currentTarget.dataset.x;
    const id = e.currentTarget.dataset.id;
    if (id) {
      this.setData({
        mask: x,
        id: id
      });
    } else {
      this.setData({
        mask: x
      });
    };
  },
  toRou(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },
  toPrFn(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../home/price/price?id=' + id,
    })
  },
  toPayFn(e){
    const id = e.currentTarget.dataset.id;
    this.setData({
      tempId: id,
      payIs: false
    })
  },
  payFn(e) {
    const _this = this;
    const val = e.detail;
    const taskid = this.data.tempId;
    if (val == 1) {
      _post(robPay, {
        userid: app.globalData.uid,
        payType: 1,
        taskid: taskid,
        price: 5
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
              app.toast('抢单成功', 'success');
              _get(code, {
                userid: app.globalData.uid,
                type: 3,
                taskid: taskid
              })
              setTimeout(_this.decrDeta, 500)
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
    const taskid = _this.data.taskid;
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
          _post(robPay, {
            userid: app.globalData.uid,
            payType: 2,
            taskid: taskid,
            price: 5
          }).then(res => {
            if (res.code == 1) {
              app.toast(res.msg);
              _this.setData({
                Value: '',
                inputValue: '',
                mask: -1
              });
              setTimeout(_this.decrDeta, 500);
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
  lookFn(e){
    const look = e.currentTarget.dataset.look;
    this.setData({
      mask:4,
      good: look
    })
  },
  onReachBottom: function() {
    const page = this.data.page;
    this.setData({
      page: page + 1
    })
    this.myRob();
  },
  onShareAppMessage: function() {

  }
})