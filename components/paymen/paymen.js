const app = getApp();
const {
  _get
} = require('../../utils/http.js');
var {
  baseSrc,
  pass
} = require('../../utils/urls.js');
Component({
  properties: {
    bool: {
      type: Boolean,
      value: true
    }
  },
  data: {
    baseSrc: baseSrc,
    contr: 1
  },
  ready: function () {
    this.setData({
      bool: this.properties.bool
    });
  },
  methods: {
    pays(e) {
      const id = e.currentTarget.dataset.id;
      this.setData({
        contr: id
      }) 
    },
    move(){
      this.setData({
        bool:true
      });
      this.triggerEvent("payFn", -2);
    },
    conf(){
      this.setData({
        bool: true
      })
      const contr = this.data.contr;
      if (contr==2){
        _get(pass, {
          userid: app.globalData.uid
        }).then(res => {
          if (res.code == 1) {
            console.log(res)
            this.triggerEvent("payFn", -1);
          } else {
            this.triggerEvent("payFn", this.data.contr);
          }
        })
      }else{
        this.triggerEvent("payFn", this.data.contr);
      }
    }
  }
})
