// pages/personalCenter/prescriptionDetail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    presData: null,
    orderId: '',
    orderNo: '',
    showBtn: false,
  },

  /**
   * 获取处方笺
   */
  getPrescriptionSign() {
    const that = this;
    let params = {
      header: {},
      body: {
        orderId: this.data.orderId, //临时测试
        orderNo: this.data.orderNo, //临时测试
      }
    };
    getApp().API.getPrescriptionSign(params).then(data => {
      if (data.code == 0) {
        that.setData({
          presData: data.data, //更新
        })
      }
    }).catch(err => {})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (options.buyDrug == '1'){
      this.setData({
        showBtn: true
      })
    }
    if (options.orderId.length == 17) {
      this.setData({
        orderNo: options.orderId
      })
    }else{
      this.setData({
        orderId: options.orderId
      })
    }
  },
  gotoShop() {
    var orderNo = '';
    if (this.data.orderNo){
      orderNo = this.data.orderNo;
    }else{
      orderNo = this.data.orderId;
    }
    wx.navigateTo({
      url: '../../mall/orderConfirm/orderConfirm?orderNo=' + orderNo + "&confirmOrderSource=" + 7,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getPrescriptionSign();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})