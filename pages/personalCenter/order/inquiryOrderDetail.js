// pages/personalCenter/order/inquiryOrderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatus: 5,  //订单状态:0_待付款,1_待发货,2_待收货,3_已完成,4_已取消,5_售后
    noDatashow: false,
    orderData: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInquiryOrderDetails(options.orderId);   //获取商城订单详情
  },

  /**
   * 问诊支付
   */
  inquiryPayfor: function (e) {
    var orderId = e.currentTarget.dataset['id'];
    console.log(orderId)
    wx.navigateTo({
      url: '/pages/mall/pay/pay?orderId=' + orderId + '&businessType=1' + '&jumpType=1'
    })
  },

  /**
   * 取消问诊订单
   */
  cancelInquiryOrder: function (e) {
    var orderId = e.currentTarget.dataset['id'];
    const that = this;
    let params = {
      header: {},
      body: {
        "orderId": orderId,
      }
    };
    getApp().API.cancelInquiryOrder(params).then(data => {
      if (data.code == 0) {
        wx.showToast({
          title: '订单已取消',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          listData: [],
        })
        that.getMallOrderList();
      }
    }).catch(err => {
      wx.showToast({
        title: '订单取消失败',
        icon: 'none',
        duration: 1000
      })
    })
  },

  /**
   * 获取商城订单详情
   */
  getInquiryOrderDetails: function (orderId) {
    const that = this;
    let params = {
      header: {},
      body: {
        "orderId": orderId,
      }
    };
    getApp().API.getInquiryOrderDetails(params).then(data => {
      if (data.code == 0) {
        console.log(data.data)
        var resData = data.data;
        this.setData({
          orderData: resData,
        });
      } else {
        this.setData({
          noDatashow: true,
        });
      }
    }).catch(err => {
      this.setData({
        noDatashow: true,
      });
    })
  },

  /**
   * 跳转到处方笺
   */
  gotoPreDetail(e) {
    var orderId = e.currentTarget.dataset['id'];
    console.log(orderId)
    let url = `/pages/personalCenter/prescriptionDetail/index?orderId=${orderId}`
    wx.navigateTo({
      url: url,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 跳转到聊天
   */
  jumpChatPage(e) {
    let token = wx.getStorageSync('token');
    var orderId = e.currentTarget.dataset['id'];
    console.log(orderId)
    let url = `/pages/chat/index/index?orderId=${orderId}&token=${token}&inquiryType=9`
    wx.navigateTo({
      url: url,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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

  },
  
  /**
   * 跳转售后
   */
  gotoAfterSale: function (e) {
    var index = e.currentTarget.dataset['index'];
    wx.navigateTo({
      url: '/pages/personalCenter/order/afterSale?orderType=' + index
    })
  }, 
})