const app = getApp();
const {
  _get
} = require('../../../utils/http.js');
const {
  good
} = require('../../../utils/urls.js');
Page({
  data: {
    val:''
  },
  onLoad: function (options) {
    _get(good, {
      goodid: 7
    }).then(res => {
      const val = res.content.good.des;
      var str = this.replFn(val);
      this.setData({
        good: res.content.good,
        val: str
      })
    })
  },
  replFn(str){
    str = str.replace(/&#039;/g, '"');
    str = str.replace(/&lt;/g, '<');
    str = str.replace(/&gt;/g, '>');
    return str;
  },
  onShareAppMessage: function () {
    
  }
})