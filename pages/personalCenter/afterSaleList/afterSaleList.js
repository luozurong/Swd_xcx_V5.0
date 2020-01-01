// pages/personalCenter/afterSaleList/afterSaleList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    current: 1,
    noMore: false,
    orderStatus: '5',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getRefundPage();
  },

  /**
   * 跳转商城订单详情
   */
  gotoMallOrderDetail: function (e) {
    var orderId = e.currentTarget.dataset['id'];
    if (this.data.orderStatus == '5') {
      wx.navigateTo({
        url: '/pages/personalCenter/order/afterSaleDetail?refundOrderId=' + orderId + '&orderType=0'
      })
    }
  },

  /**
   * 获取商城售后订单列表
   */
  getRefundPage: function () {
    const that = this;
    let params = {
      header: {},
      body: {
        "current": this.data.current,
        "size": 20,
      }
    };
    wx.showLoading({
      title: '加载中..',
    })
    getApp().API.getRefundPage(params).then(data => {
      if (data.code == 0) {
        var resData = data.data.records;
        if (resData.length) {
          var tempArr = this.data.listData;
          for (var i in resData) {
            tempArr.push(resData[i])
            if (resData[i].comList.length) {
              var goodsNum = 0;
              for (var j in resData[i].comList) {
                goodsNum = goodsNum + resData[i].comList[j].qty;
              }
              resData[i].goodsNum = goodsNum;
            } else {
              resData[i].goodsNum = '0';
            }
          }
          this.setData({
            listData: tempArr,
          });
        } else {
          var tempArr = this.data.listData;
          this.setData({
            listData: tempArr,
            noDatashow: true,
          });
        }
        if (resData.length == 20) {
          this.setData({
            current: this.data.current + 1,
          });
        } else {
          this.setData({
            noMore: true,
          });
        }
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      }
    }).catch(err => {
      var tempArr = this.data.listData;
      this.setData({
        listData: tempArr,
        noDatashow: true,
      });
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    })
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