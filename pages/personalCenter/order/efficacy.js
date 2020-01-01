// pages/personalCenter/order/efficacy.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: null,
    efficacyOrderId: null,
    listDatas: null
  },

  attached(){
    console.log(this.data.listDatas)
  },

  pageLifetimes: {
    show: function () {
      // 页面被展示
      console.log(this.data.listDatas)
    },
    hide: function () {
     
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    sureBtn(){
      wx.navigateTo({
        url: '/pages/mall/orderConfirm/orderConfirm?confirmOrderSource=3&orderNo=' + this.data.efficacyOrderId
      })
      this.setData({
        isShow: false
      })
    },
    cancelBtn(){
      console.log(this.data.listDatas)
      this.setData({
        isShow: false
      })
    }
  }
})
