const app = getApp();
const {
  _get
} = require('../../../utils/http.js')
const {
  baseSrc,
  fileList
} = require('../../../utils/urls.js');
Page({
  data: { 
    baseSrc: baseSrc,
    page: 1,
    pagesize: 20,
    list: [],
    is:false,
    iss:false
  },
  onLoad: function(o) {
    if(o.type){
      if (!app.globalData.is) {
        this.setData({
          iss: true
        })
        return false;
      }
    }
    // this.list();
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
  isFn(){
    this.setData({
      iss: true
    })
  },
  list() {
    _get(fileList, {
      userid: app.globalData.uid,
      // userid: 383,
      page: this.data.page,
      pagesize: this.data.pagesize
    }).then(res => {
      const list = res.content.list;
      for (let i = 0; i < list.length; i++) {
        list[i].check = false;
      }
      this.setData({
        list: [...this.data.list, ...list]
      })
    })
  },
  navTo(e) {
    const type = e.currentTarget.dataset.type;
    if (type == 1) {//如果为1,就是文件夹类型,去下一层
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../baseData/baseData?id=' + id
      })
      return false;
    }
    const url = e.currentTarget.dataset.url;
    if (type == 2) { //如果为2,就是文件类型在线预览
      this.lookFile(url)
    }
    if (type == 3) {//如果为3,就是图片类型在线预览
      this.lookPic(url)
    }
  },
  // 打开文档
  lookFile(url){
    wx.showLoading({
      title: '正在打开文档'
    });
    wx.downloadFile({
      url: url,
      success: function (res) {
        const path = res.tempFilePath;
        wx.openDocument({
          filePath: path,
          success: function () {
            wx.hideLoading();
          },
          fail: function () {
            app.toast('文档打开失败！');
            wx.hideLoading();
          }
        })
      },
      fail: function (err) {
        wx.hideLoading();
        app.toast('文档打开失败！');
      }
    });
    // wx.downloadFile({
    //   url: url,
    //   success: function (res) {
    //     const path = res.tempFilePath;
    //     wx.saveFile({
    //       tempFilePath: path,
    //       success(r) {
    //         const paths = r.savedFilePath;
    //         wx.openDocument({
    //           filePath: paths,
    //           success: function () {
    //             wx.hideLoading();
    //           },
    //           fail: function () {
    //             app.toast('文档打开失败！');
    //             wx.hideLoading();
    //           }
    //         })
    //       }
    //     })
    //   },
    //   fail: function (err) {
    //     wx.hideLoading();
    //     app.toast('打开失败！')
    //   }
    // });
  },
  //查看图片
  lookPic(url){
    var pics = [];
    pics.push(url);
    wx.showLoading({
      title: '正在寻找图片资源'
    });
    wx.previewImage({
      current: url,
      urls: pics,
      success: function () {
        wx.hideLoading();
      },
      fail: function () {
        app.toast('图片打开失败！');
        wx.hideLoading();
      }
    })
  },
  checkFn(e) {
    var item, isF = false, is = false;
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
        item=list[i];
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
      success: function () {
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
    var id = item.id;
    var name = item.name;
    if(type){
      var src;
      if(type==1){
        src = 'pages/my/base/base?type=' + type
      }else{
        src = 'pages/my/baseFile/baseFile?id=' + id
      }
      return {
        title: name,
        path: src,
        imageUrl: pic
      }
    }
  }
})