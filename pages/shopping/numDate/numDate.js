const app = getApp();
const {
  _get
} = require('../../../utils/http.js');
const {
  baseSrc,
  score
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    page: 1,
    pagesize: 20,
    list: []
  },
  onLoad: function (options) {
    this.score()
  },
  score(){
    _get(score, {
      userid: app.globalData.uid,
      page: this.data.page,
      pagesize: this.data.pagesize
    }).then(res => {
      const list = res.content.list;
      this.setData({
        list: [...this.data.list, ...list]
      })
    })
  },
  onReachBottom: function () {
    const page = this.data.page;
    this.setData({
      page: page + 1
    })
    this.score();
  },
  onShareAppMessage: function () {

  }
})