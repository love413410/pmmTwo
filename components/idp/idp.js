const {
  _get
} = require('../../utils/http.js')
const {
  getIdp
} = require('../../utils/urls.js');
Component({
  properties: {
    bool: {
      type: Boolean,
      value: true
    }
  },
  data: {
    bool: true,
    h: '',
    idpArr: [],
    idp: '',
    value: 0
  },
  ready: function () {
    this.setData({
      bool: this.properties.bool
    });
    const _this = this;
    wx.getSystemInfo({
      success(res) {
        const rpx = res.screenHeight * res.pixelRatio;
        _this.setData({
          h: rpx + 'rpx'
        })
      }
    })
  },
  pageLifetimes: {
    show: function () {
      this.idp()
    },
  },
  methods: {
    idp() {
      const _this = this;
      _get(getIdp).then(res => {
        const list = res.content.province;
        _this.setData({
          idpArr: list,
          idp: list[_this.data.value].region_id
        });
      })
    },
    
    bindChange(e) {
      const index = e.detail.value;
      const idp = this.data.idpArr[index[0]].region_id;
      this.setData({
        idp: idp,
        value: index
      })
      this.idp();
    },
    cancel() {
      this.setData({
        bool: true
      })
    },
    comp() {
      this.setData({
        bool: true
      })
      const index = this.data.value;
      const idp = this.data.idpArr[index].region_id;
      const idpName = this.data.idpArr[index].region_name;
     
      const link = {
        idp: idp,
        val: idpName
      };
      this.triggerEvent("idpFn", link);
    },
  }
})