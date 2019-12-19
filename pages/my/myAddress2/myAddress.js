const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js')
const {
  myAddressList,
  exchange,
  del
} = require('../../../utils/urls.js');
Page({
  data: {
    list: [],
    page: 1,
    pagesize: 20
  },
  onLoad: function(o) {
    this.setData({
      id: o.id
    })
  },
  onShow: function() {
    this.setData({
      list: [],
      page: 1,
    });
    this.myAddressList();
  },
  myAddressList() {
    const _this = this;
    _get(myAddressList, {
      userid: app.globalData.uid,
      page: _this.data.page,
      pagesize: _this.data.pagesize
    }).then(res => {
      const list = res.content.list;
      list[0].checked = true;
      _this.setData({
        val: list[0].id,
        list: [..._this.data.list, ...list]
      })
    })
  },
  radioChange(e) {
    const val = e.detail.value;
    this.setData({
      val: val
    })
  },
  addTo(e) {
    const id = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '../address/address?id=' + id
    })
  },
  send() {
    _post(exchange, {
      userid: app.globalData.uid,
      goodid: this.data.id,
      addressid: this.data.val
    }).then(res => {
      if (res.code == 1) {
        app.toast(res.msg, 'success');
        setTimeout(function () {
          wx.redirectTo({
            url: '../../shopping/excReco/excReco'
          });
        }, 1000);
      } else {
        app.toast(res.msg)
      }
    })
  },
  delClick(e) {
    const _this = this;
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除地址',
      content: '确定删除该地址？',
      success(res) {
        if (res.confirm) {
          _post(del, {
            id: id
          }).then(res => {
            app.toast(res.msg);
            setTimeout(function () {
              _this.setData({
                list: [],
                page: 1,
              });
              _this.myAddressList();
            }, 1000);
          })
        } else if (res.cancel) {
          app.toast('已取消删除')
        }
      }
    })
  },
  onReachBottom: function() {
    const page = this.data.page;
    this.setData({
      page: page + 1
    })
    this.myAddressList();
  },
  onShareAppMessage: function() {

  }
})