var wxCharts = require('../../../utils/wxcharts.js');
const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js')
const {
  baseSrc,
  reportSpecial,
  report
} = require('../../../utils/urls.js');
var lineChart = null;

Page({
  data: {
    baseSrc: baseSrc,
    nameScree: [],
    index: 0,
    messarr: [],
    percent: '',
    good: 0,
    bad: 0,
    date: '',
    column: null,
    ring: null,
    dataX: [],
    dataY: [],
    max:1,
    buserid: 0

  },
  onLoad: function (e) {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    this.setData({
      date: y + '-' + m
    });
    this.pickFn();
    this.reportFn()
  },
  pickFn(){
    const _this = this;
    _get(reportSpecial, {
      userid: app.globalData.uid
    }).then(res => {
      if (res.code == 1) {
        var obj = {
          nickname: '全部',
          id: '0'
        }
        var arr = [];
        arr.push(obj);
        var list = res.content.list;
        _this.setData({
          nameScree: [...arr, ...list]
        })
      }
    })
  },
  
  reportFn() {
    const _this = this;
    _get(report, {
      userid: app.globalData.uid,
      stime: this.data.date,
      buserid: this.data.buserid
    }).then(res => {
      if (res.code == 1) {
        const list = res.content.list;
        if (list.length>0){
          const percent = res.content.percent;
          const bad = res.content.bad;
          const good = res.content.good;
          const dataX = [], dataY = [];
          for (let i = 0; i < list.length; i++) {
            dataX.push(list[i].name)
            dataY.push(list[i].count)
          }
          var max = dataY[0];
          for (let i = 0; i < dataY.length; i++) {
            var cur = dataY[i];
            cur > max ? max = cur : max = 10
          }
          max < 10 ? max = 10 : max = max;
          const num = 100 - percent;
          const cakeArr = [{
            color: '#fb7313',
            num: percent,
            flownum: percent
          }, {
            color: '#eeeeee',
            num: num,
            flownum: num
          }];
          _this.setData({
            dataX: dataX,
            dataY: dataY,
            percent: percent + '%',
            good: good,
            bad: bad,
            cakeArr: cakeArr,
            max: max
          })
          _this.initColumn();
          _this.initRing();
        }
      }
    })
  },
  scroll: function (e) {
    var scrollLeft = e.detail.scrollLeft;
    this.setData({
      scrollLeft: scrollLeft
    })
  },
  initColumn() {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    if (windowWidth < this.data.dataX.length * 70) {
      windowWidth = this.data.dataX.length * 70
    }
    const dataLength = this.data.dataX.length
    this.setData({
      dataLength: dataLength
    })
    this.data.column = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'column',
      categories: this.data.dataX,
      legend: false,
      animation: true,
      series: [{
        data: this.data.dataY,
        format: function (val, name) {
          return val + '笔';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        min: 0,
        max: this.data.max,
        format: function (val) {
          return val;
        },
      },
      width: windowWidth,
      height: 200,
      dataLabel: true,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  initRing(){
    const _this=this;
    this.data.ring = new wxCharts({
      animation: true,
      canvasId: 'ring',
      type: 'ring',
      extra: {
        ringWidth: 15
      },
      title: {
        name: _this.data.percent,
        color: '#fb7313',
        fontSize: 25
      },
      series: [{
        data: _this.data.good,
        stroke: false,
        color:'#fb7313'
      }, {
        data: _this.data.bad,
        stroke: false,
        color: '#eee',
      }],
      disablePieStroke: true,
      width: 200,
      height: 200,
      dataLabel: false,
      legend: false,
      padding: 0
    });
  },
  datePickFn: function (e) {
    this.setData({
      date: e.detail.value,
      dataX: [],
      dataY: []
    })
    this.reportFn()
  },
  namePickFn: function (e) {
    this.setData({
      index: e.detail.value,
      buserid: this.data.nameScree[e.detail.value].id,
      dataX: [],
      dataY: []
    })
    this.reportFn()
  },
  onShareAppMessage: function () {

  }
});