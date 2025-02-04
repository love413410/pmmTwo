const app = getApp();
const {
  _get
} = require('../../../utils/http.js')
const {
  baseSrc,
  folder
} = require('../../../utils/urls.js');
Page({
  data: {
    baseSrc: baseSrc,
    is: false,
    iss: false,
    id: '',
    page: 1,
    pagesize: 20,
    list: [],
  },
  onLoad: function(o) {
    this.setData({
      id: o.id
    })
    if (o.type) {
      if (!app.globalData.is) {
        this.setData({
          iss: true
        })
        return false;
      }
    }
  },
  popupFn(e) {
    const code = e.detail.code;
    if (code == -1) {
      app.toast("获取用户信息失败")
    } else if (code == 0) {
      const openId = e.detail.openId;
      app.globalData.openId = openId;
      wx.navigateTo({
        url: '../../login/login'
      })
    } else {
      this.setData({
        page: 1,
        pagesize: 20,
        list: [],
        iss: false
      })
      this.list();
    }
  },
  isFn() {
    this.setData({
      iss: true
    })
  },
  list() {
    wx.showLoading({
      title: '正在加载数据'
    });
    _get(folder, {
      userid: app.globalData.uid,
      wjjid: this.data.id,
      page: this.data.page,
      pagesize: this.data.pagesize
    }).then(res => {
      const list = res.content.list;
      for (let i = 0; i < list.length; i++) {
        list[i].check = false;
      }
      this.setData({
        list: [...this.data.list, ...list]
      });
      wx.hideLoading();
    })
  },
  navTo(e) {
    const type = e.currentTarget.dataset.type;
    if (type == 1) {
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../baseData2/baseData2?id=' + id
      })
      return false;
    }
    const url = e.currentTarget.dataset.url;
    if (type == 2) {
      this.lookFile(url)
    }
    if (type == 3) {
      this.lookPic(url)
    }
  },
  lookFile(url) {
    wx.showLoading({
      title: '正在打开文档'
    });
    wx.downloadFile({
      url: url,
      success: function(res) {
        const path = res.tempFilePath;
        wx.openDocument({
          filePath: path,
          success: function() {
            wx.hideLoading();
          },
          fail: function() {
            app.toast('文档打开失败！');
            wx.hideLoading();
          }
        })
      },
      fail: function(err) {
        wx.hideLoading();
        app.toast('文档打开失败！');
      }
    });
  },
  lookPic(url) {
    wx.showLoading({
      title: '正在寻找图片资源'
    });
    var pics = [];
    pics.push(url);
    wx.previewImage({
      current: url,
      urls: pics,
      success: function() {
        wx.hideLoading();
      },
      fail: function() {
        app.toast('图片打开失败！');
        wx.hideLoading();
      }
    })
  },
  checkFn(e) {
    var item, isF = false,
      is = false;
    const arr = e.detail.value;
    const val = arr.pop();
    if (val != undefined) {
      is = true;
    };
    const list = this.data.list;
    for (let i = 0; i < list.length; i++) {
      list[i].check = false;
      if (list[i].id == val) {
        list[i].check = true;
        item = list[i];
      }
    };
    if (item) {
      isF = item.type == 1 ? false : true;
      is = item.type == 1 ? true : false;
    }
    this.setData({
      list: list,
      is: is,
      item: item,
      isF: isF
    });
  },
  ctrlFn() {
    const item = this.data.item;
    wx.setClipboardData({
      data: item.content,
      success: function() {
        app.toast('地址复制成功,请至浏览器下载！')
      }
    });
  },
  onReachBottom: function() {
    const page = this.data.page;
    this.setData({
      page: page + 1
    })
    this.list();
  },
  onShareAppMessage: function() {
    const item = this.data.item;
    var type = item.type;
    var pic = item.img;
    var id = this.data.id;
    const idd = item.id;
    const name = item.name;
    if (type) {
      var src;
      if (type == 1) {
        src = 'pages/my/baseData/baseData?type=' + type + '&id=' + id;
      } else {
        src = 'pages/my/baseFile/baseFile?id=' + idd
      }
      return {
        title: name,
        path: src,
        imageUrl: pic
      }
    }
  }
})