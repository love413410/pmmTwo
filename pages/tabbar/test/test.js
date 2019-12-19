const app = getApp();
const {
  _get
} = require('../../../utils/http.js');
const {
  good
} = require('../../../utils/urls.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    val:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})