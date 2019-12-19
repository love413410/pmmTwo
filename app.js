var QQMapWX = require('./utils/qqmap-wx-jssdk.js');
var qqmapsdk;
App({
  onLaunch: function () {
    qqmapsdk = new QQMapWX({
      key:'BBDBZ-GLQCU-3OTVY-BEJEO-KRUM6-X5BLV'
    });
    wx.getSetting({ 
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })  
        } 
      }
    })
  },
  toast(e, icon = 'none', duration = 2000) {
    wx.showToast({
      title: e,
      icon: icon,
      duration: duration
    })
  },
  trim(val) {
    const reg = /\S/;
    if (!val) {
      return false;
    } else {
      val.trim();
      return reg.test(val);
    } 
  },
  regex(val) {
    var regex = /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/;
    return regex.test(val);
  },
  regmp(val){
    var regmp = /^1[3456789]\d{9}$/;
    return regmp.test(val);
  },
  globalData: {
    is:false,
    userInfo: null,
    openId: '',
    // uid: 85,
    uid: '',

  },
  //获取当前位置
  getLoca() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        success: (res) => {
          resolve(res)
        },
        fail: (f) => {
          wx.getSetting({
            success: res => {
              var statu = res.authSetting;
              if (!statu['scope.userLocation']) {
                wx.showModal({
                  title: '是否授权当前位置',
                  content: '需要获取您的地理位置，请确认授权，否则定位功能将无法使用',
                  success: tip => {
                    if (tip.confirm) {
                      wx.openSetting({
                        success: data => {
                          if (data.authSetting["scope.userLocation"] === true) {
                            wx.getLocation({
                              success: e => {
                                resolve(e)
                              }
                            })
                          }
                        }
                      })
                    } if (tip.cancel) {
                      reject('err')
                    }
                  }
                })
              }
            }
          })
        }
      })
    })
  },
  //经纬度转换成地址
  getLocal(e) { 
    return new Promise((resolve, reject) => {
      let _this = this;
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: e.lat,
          longitude: e.lng
        },
        success: (res) => {
          // const city = res.result.address_component.city;
          resolve(res)
        },
        fail: (f) => {
          reject(f)
        }
      })
    })
  },
  //地址转换成经纬度
  getLocat(e) {
    return new Promise((resolve, reject) => {
      qqmapsdk.geocoder({
        address: e,
        success: (res) => {
          const loc = res.result.location;
          resolve(loc)
        },
        fail: (f) => {
          reject(f)
        }
      })
    })
  }
})