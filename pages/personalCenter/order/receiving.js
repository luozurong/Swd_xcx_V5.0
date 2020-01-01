// pages/personalCenter/order/receiving.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,
    })
  },

  /**
   * 跳转订单详情
   */
  gotoOrDetail: function () {
    var orderId = this.data.orderId;
    wx.navigateTo({
      url: '/pages/personalCenter/order/mallOrderDetail?orderId=' + orderId
    })
  },

  /**
   * 跳转去评价
   */
  gotoEvaluate: function () {
    let id = this.data.orderId;
    wx.redirectTo({
      url: '/pages/personalCenter/evaluate/evaluate?id=' + id +'&source=orderList'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})