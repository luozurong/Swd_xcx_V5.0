// pages/personalCenter/order/afterSaleDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics: [], //图片
    orderType: 0,  //订单类型0：商城订单， 1：问诊订单
    resData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderType: options.orderType,
    });
    this.getRefundOrder(options.refundOrderId);
  },

  /**
  * 提交售后申请
  */
  getRefundOrder(id) {
    let params = {
      header: {},
      body: {
        refundOrderId: id,
      }
    };
    getApp().API.getRefundOrder(params).then(res => {
      if (res.code == 0) {
        var resData = res.data;
        var picStr = resData.refundImg;
        var picArr = [];
        if (picStr.indexOf(';') != -1){
          var tempArr = picStr.split(';');
          for (var i in tempArr){
            picArr.push(tempArr[i])
          }
        }else{
          if (picStr.length){
            picArr.push(picStr)
          }
        }
        this.setData({
          resData: resData,
          pics: picArr
        });
      }
    }).catch(err => {
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
  
  // 预览图片
  previewImg1: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var pics = this.data.pics;
    wx.previewImage({
      //当前显示图片
      current: pics[index],
      //所有图片
      urls: pics
    })
  },
})