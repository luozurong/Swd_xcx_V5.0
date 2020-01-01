import baseUrl from '../../../apis/baseUrl.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: "",
    orderId: '',
    link: '',
    sources: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var token = wx.getStorageSync('token');
    var orderId = options.orderId;
    var inquiryType = 6;
    var source;
    if (options.source) {
      source = options.source;
      this.setData({
        source: options.source
      })
    }
    if (options.inquiryType) {
      inquiryType = options.inquiryType;
    }
    this.setData({
      orderId: orderId
    })
    var linkUrl = baseUrl + "/nfysH5/chat?token=" + token + "&orderId=" + orderId + '&inquiryType=' + inquiryType;
    console.log(linkUrl)
    this.setData({
      link: linkUrl
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
    if (this.data.source) {
      var source = this.data.source;
      if (source == 'chatView') {
        wx.reLaunch({
          url: '../../index/index'
        })
      }
    } 
    // else {
    //   // console.log(111111111)
    //   wx.navigateTo({
    //     url: '/pages/personalCenter/myInquiry/myInquiry',
    //   })
    // }
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