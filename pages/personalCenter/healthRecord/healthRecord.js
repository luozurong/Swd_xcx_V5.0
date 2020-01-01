// pages/personalCenter/healthRecord/healthRecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
   * 跳转基本信息
   */
  gotoBasicInfo: function () {
    wx.navigateTo({
      url: '/pages/personalCenter/healthRecord/basicInfo'
    })
  }, 

  /**
   * 跳转我的病例
   */
  gotoBingli: function () {
    wx.navigateTo({
      url: '/pages/personalCenter/myRecord/myrecord'
    })
  }, 

  /**
   * 跳转购药记录
   */
  gotoBuyMedicineRecord: function () {
    wx.navigateTo({
      url: '/pages/personalCenter/healthRecord/buyMedicineRecord'
    })
  }, 

})