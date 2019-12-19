const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js')
const {
  myAddressList,
  del
} = require('../../../utils/urls.js');
Page({
  data: {
    list: [],
    page: 1,
    pagesize: 20
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
      // for (let i = 0; i < list.length; i++) {
      //   list[i].is = false;
      // }
      _this.setData({
        list: [..._this.data.list, ...list]
      })
    })
  },
  addTo(e) {
    const id = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '../address/address?id=' + id
    })
  },
  isFn(e) {
    const idx = e.currentTarget.dataset.idx;
    const list = this.data.list;
    list[idx].is = true;
    this.setData({
      list: list
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
            setTimeout(function() {
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