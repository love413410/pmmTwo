const app = getApp();
const {
  _get,
  _post
} = require('../../../utils/http.js')
const {
  baseSrc,
  specialDispatchList,
  dispatch,
  specialListNew,
  myDeta
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    mask: false,
    page: 1,
    pagesize: 20,
    list: [],
    opinion:0
  },
  onLoad: function(o) {
    this.setData({
      taskid: o.id
    })
    this.myDeta();
  },
  myDeta(){
    const _this=this;
    _get(myDeta, {
      userid: app.globalData.uid
    }).then(res => {
      if (res.code == 1) {
        const officer = res.content.user.officer;
        const staff = res.content.user.staff;
        const cityId = res.content.user.province;
        _this.setData({
          officer: officer,
          staff: staff,
          cityId: cityId
        });
        _this.list();
      }
    })
  },
  list() {
    const _this = this;
    _get(specialDispatchList, {
      userid: app.globalData.uid,
      taskid: this.data.taskid,
      page: this.data.page,
      pagesize: this.data.pagesize
    }).then(res => {
      if (res.code == 1) {
        const list = res.content.list;
        const opinion = res.content.opinion;
        const temp = [];
        for (let l = 0; l < list.length; l++) {
          temp.push(list[l].userid)
        }
        _this.setData({
          list: [..._this.data.list, ...list],
          userid: temp,
          opinion: opinion
        })
      }
    })
  },
  checkboxChange: function(e) {
    const arr = e.detail.value;
    this.setData({
      checked: arr
    })
  },
  toRou() {
    const _this = this;
    const arr = this.data.checked;
    const userid = this.data.userid;
    if (arr.length == userid.length){
      app.toast('改派需要选择一个新的技术人员！');
      return
    } else if (arr.length - userid.length>1){
      app.toast('改派最多选择一个新的技术人员！');
      return
    }
    const str = arr.join(',');
    const taskid = this.data.taskid;
    _post(dispatch, {
      userids: str,
      id: taskid,
      change:1,
      pdid: this.data.id,
    }).then(res => {
      app.toast(res.msg);
      _this.setData({
        page:1,
        list:[],
        mask: false
      })
      setTimeout(_this.list,500)
    })

    
  },
  move() {
    this.setData({
      mask: false
    })
  },
  send(e) {
    const _this = this;
    const id = e.currentTarget.dataset.id;
    _get(specialListNew, {
      province: this.data.cityId
    }).then(res => {
      if (res.code == 1) {
        const userid = this.data.userid;
        const user = res.content.list;
        const temp = [];
        for (let j = 0; j < user.length; j++) {
          var obj = {
            name: user[j].nickname,
            id: user[j].id,
            checked: false,
            dibd: false
          }
          temp.push(obj);
        }
        for (let i = 0; i < userid.length; i++) {
          for (let k = 0; k < temp.length; k++) {
            if (userid[i] == temp[k].id) {
              temp[k].checked = true
              temp[k].dibd = true
            }
          }
        }
        _this.setData({
          user: temp,
          mask: true,
          id: id
        })
      }
    })
  },

  rouTo() {
    wx.navigateTo({
      url: '../sendData/sendData?to=2&id=' + this.data.taskid
    })
  },
  rediFn(e){
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../feedDate/feedDate?id=' + item.taskid + '&source=2' + '&buserid=' + item.buserid
    })
  },
  onReachBottom: function() {
    const page = this.data.page;
    this.setData({
      page: page + 1
    })
    this.list();
  },
  onShareAppMessage: function() {

  }
})