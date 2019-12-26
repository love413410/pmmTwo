const app = getApp();
const {
  _get
} = require('../../../utils/http.js')
const {
  walle
} = require('../../../utils/urls.js');
Page({
  data: {

  },
  onLoad: function(o) {
    this.walle(o.id);
  },
  walle(e) {
    const _this = this;
    _get(walle, {
      userid: app.globalData.uid,
      statement_id: e
    }).then(res => {
      if (res.code == 1) {
        const list = res.content.sett_statement;
        _this.setData({
          pic: list.pic,
          matter: list.matter,
          amount: list.amount,
          status_txt: list.status_txt,
          is_button: list.is_button,
          payTime: list.payTime,
          is: list.name_type,
          taskid: list.taskid,
          type: list.tasktype
        })
      }
    })
  },
  navTo() {
    const ty = this.data.type;
    const id = this.data.taskid;
    let src;
    switch (ty) {
      case '1':
        src = '../../home/releDeta/releDeta?t=2&id=' + id;
        break;
      case '2':
        src = '../../home/colleDeta/colleDeta?t=2&id=' + id;
        break;
      case '3':
        src = '../../home/whoDeta/whoDeta?t=2&id=' + id;
        break;
      case '4':
        src = '../../home/couDeta/couDeta?t=2&id=' + id;
        break;
      case '5':
        src = '../../home/leaDeta/leaDeta?t=2&id=' + id;
        break;
      default:
        src = '../../home/newDeta/newDeta?t=2&id=' + id;

    }
    wx.navigateTo({
      url: src
    })
  },
  onShareAppMessage: function() {

  }
})