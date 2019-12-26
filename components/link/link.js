const {
  _get
} = require('../../utils/http.js')
const {
  getIdp, 
  getIdc,
  getIdd
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
    idcArr: [],
    idc: '',
    iddArr: [],
    idd: '',
    value: [0, 0, 0]
  },
  ready: function() {
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
    show: function() {
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
          idp: list[_this.data.value[0]].region_id
        });
        _this.idc()
      })
    },
    idc() {
      const _this = this;
      _get(getIdc, {
        province_id: this.data.idp
      }).then(res => {
        const list = res.content.city;
        _this.setData({
          idcArr: list,
          idc: list[_this.data.value[1]].region_id
        });
        _this.idd()
      })
    },
    idd() {
      const _this = this;
      _get(getIdd, {
        city_id: this.data.idc
      }).then(res => {
        const list = res.content.district;
        if(list.length>0){
          _this.setData({
            iddArr: list,
            idd: list[0].region_id
          });
        }
      })
    },
    bindChange(e) {
      const index = e.detail.value;
      const idp = this.data.idpArr[index[0]].region_id;
      const idc = this.data.idcArr[index[1]].region_id;
      const idd = this.data.iddArr[index[2]].region_id;
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
      const idp = this.data.idpArr[index[0]].region_id;
      const idc = this.data.idcArr[index[1]].region_id;
      const idd = this.data.iddArr[index[2]].region_id;
      const idpName = this.data.idpArr[index[0]].region_name;
      const idcName = this.data.idcArr[index[1]].region_name;
      const iddName = this.data.iddArr[index[2]].region_name;
      const val = `${idpName}${idcName}${iddName}`;
      const link = {
        idp: idp,
        idc: idc,
        idd: idd,
        val: val
      };
      this.triggerEvent("linkFn", link);
    },
  }
})